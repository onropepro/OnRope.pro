/**
 * Help Center API Routes
 * Handles chat, search, articles, and feedback for the Knowledge Base
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { 
  helpArticles, 
  helpConversations, 
  helpMessages, 
  helpSearches,
  insertHelpConversationSchema,
  insertHelpMessageSchema,
  insertHelpSearchSchema,
} from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import {
  queryRAG,
  searchArticles,
  getAllArticles,
  getArticleBySlug,
  getArticlesForStakeholder,
  indexAllGuides,
  guideRegistry,
} from '../services/ragService';

const router = Router();

/**
 * POST /api/help/chat
 * Send a message to the AI assistant
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationId, userType = 'visitor' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    let conversation;
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    if (conversationId) {
      // Get existing conversation and history
      const existingConv = await db.select()
        .from(helpConversations)
        .where(eq(helpConversations.id, conversationId))
        .limit(1);
      
      if (existingConv.length > 0) {
        conversation = existingConv[0];
        
        // Get conversation history
        const messages = await db.select()
          .from(helpMessages)
          .where(eq(helpMessages.conversationId, conversationId))
          .orderBy(helpMessages.createdAt);
        
        conversationHistory = messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      }
    }
    
    // Create new conversation if needed
    if (!conversation) {
      const [newConv] = await db.insert(helpConversations)
        .values({
          userType,
          sessionId: req.sessionID || null,
          userId: (req as any).user?.id || null,
        })
        .returning();
      conversation = newConv;
    }
    
    // Save user message
    await db.insert(helpMessages).values({
      conversationId: conversation.id,
      role: 'user',
      content: message,
    });
    
    // Query RAG for response
    const response = await queryRAG(message, conversationHistory);
    
    // Save assistant message
    const [assistantMessage] = await db.insert(helpMessages)
      .values({
        conversationId: conversation.id,
        role: 'assistant',
        content: response.message,
        sources: response.sources,
      })
      .returning();
    
    // Update conversation timestamp
    await db.update(helpConversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(helpConversations.id, conversation.id));
    
    res.json({
      conversationId: conversation.id,
      message: response.message,
      sources: response.sources,
      messageId: assistantMessage.id,
    });
  } catch (error: any) {
    console.error('[Help Chat] Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

/**
 * GET /api/help/search
 * Search articles using text-based search
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, userType = 'visitor' } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const articles = await searchArticles(q, 10);
    
    // Track search for analytics
    await db.insert(helpSearches).values({
      query: q,
      resultsCount: articles.length,
      userType: userType as string,
      sessionId: req.sessionID || null,
    });
    
    // Format results with excerpts
    const results = articles.map(article => ({
      ...article,
      excerpt: article.content?.substring(0, 200) + '...' || article.description,
    }));
    
    res.json({
      query: q,
      results,
      total: articles.length,
    });
  } catch (error: any) {
    console.error('[Help Search] Error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/help/articles
 * Get all published articles
 */
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const { category, stakeholder } = req.query;
    
    let articles;
    
    if (stakeholder && typeof stakeholder === 'string') {
      articles = await getArticlesForStakeholder(stakeholder);
    } else {
      articles = await getAllArticles();
    }
    
    if (category && typeof category === 'string') {
      articles = articles.filter(a => a.category === category);
    }
    
    res.json({ articles });
  } catch (error: any) {
    console.error('[Help Articles] Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

/**
 * GET /api/help/articles/:slug
 * Get a single article by slug
 */
router.get('/articles/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const article = await getArticleBySlug(slug);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ article });
  } catch (error: any) {
    console.error('[Help Article] Error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

/**
 * POST /api/help/feedback
 * Submit feedback for a chat message
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { messageId, feedback } = req.body;
    
    if (!messageId || !feedback) {
      return res.status(400).json({ error: 'Message ID and feedback are required' });
    }
    
    if (!['positive', 'negative'].includes(feedback)) {
      return res.status(400).json({ error: 'Feedback must be positive or negative' });
    }
    
    await db.update(helpMessages)
      .set({ feedback })
      .where(eq(helpMessages.id, messageId));
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('[Help Feedback] Error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

/**
 * POST /api/help/reindex
 * Reindex all Guide content (admin only)
 */
router.post('/reindex', async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated and is superuser
    const user = (req as any).user;
    if (!user || user.role !== 'superuser') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await indexAllGuides();
    res.json({ 
      success: true, 
      indexed: result.success, 
      failed: result.failed,
    });
  } catch (error: any) {
    console.error('[Help Reindex] Error:', error);
    res.status(500).json({ error: 'Reindex failed' });
  }
});

/**
 * GET /api/help/modules
 * Get list of all available modules/guides (excludes Popular Topics)
 */
router.get('/modules', async (req: Request, res: Response) => {
  try {
    // Filter out items marked as hideFromModulesGrid (Popular Topics)
    const modules = guideRegistry.filter((m: any) => !m.hideFromModulesGrid);
    res.json({ modules });
  } catch (error: any) {
    console.error('[Help Modules] Error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

/**
 * GET /api/help/categories
 * Get list of categories with article counts
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const articles = await getAllArticles();
    
    const categoryMap = new Map<string, { name: string; count: number }>();
    
    for (const article of articles) {
      if (!categoryMap.has(article.category)) {
        categoryMap.set(article.category, { 
          name: article.category, 
          count: 0 
        });
      }
      categoryMap.get(article.category)!.count++;
    }
    
    const categories = [
      { id: 'operations', name: 'Operations', icon: 'Briefcase' },
      { id: 'safety', name: 'Safety & Compliance', icon: 'Shield' },
      { id: 'hr', name: 'HR & Team', icon: 'Users' },
      { id: 'financial', name: 'Financial', icon: 'DollarSign' },
      { id: 'communication', name: 'Communication', icon: 'MessageSquare' },
      { id: 'customization', name: 'Customization', icon: 'Palette' },
    ].map(cat => ({
      ...cat,
      count: categoryMap.get(cat.id)?.count || 0,
    }));
    
    res.json({ categories });
  } catch (error: any) {
    console.error('[Help Categories] Error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
