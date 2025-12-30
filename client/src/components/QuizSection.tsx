import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ClipboardList, CheckCircle2, XCircle, Clock, ArrowRight, Loader2, Trophy, AlertCircle, ChevronLeft, ChevronRight, Award, GraduationCap, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Quiz {
  id: string | number;
  documentType?: string;
  title?: string;
  certification?: "irata" | "sprat";
  level?: number;
  quizCategory: "company" | "certification" | "safety";
  category?: "swp" | "flha" | "harness" | "general_safety";
  jobType?: string;
  questionCount: number;
  createdAt?: string;
  hasPassed: boolean;
  attemptCount: number;
  lastAttempt: string | null;
}

interface Question {
  questionNumber: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface QuizResult {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  answers: { questionNumber: number; selected: string; correct: string; isCorrect: boolean }[];
}

export function QuizSection() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current language from i18n
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language?.substring(0, 2) || 'en';

  // Fetch available quizzes
  const { data: quizzesData, isLoading } = useQuery<{ quizzes: Quiz[] }>({
    queryKey: ["/api/quiz/available"],
  });

  // Fetch quiz questions when a quiz is selected (with language parameter)
  const { data: questionsData, isLoading: loadingQuestions } = useQuery<{ quiz: { id: string | number; documentType?: string; title?: string; certification?: string; level?: number; quizCategory?: string; questions: Question[] } }>({
    queryKey: ["/api/quiz", selectedQuiz?.id, currentLanguage],
    queryFn: async () => {
      const response = await fetch(`/api/quiz/${selectedQuiz?.id}?lang=${currentLanguage}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      return response.json();
    },
    enabled: !!selectedQuiz && !quizResult,
  });

  const quizzes = quizzesData?.quizzes || [];
  const questions = questionsData?.quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Separate quizzes by category
  const companyQuizzes = quizzes.filter(q => q.quizCategory === 'company');
  const certificationQuizzes = quizzes.filter(q => q.quizCategory === 'certification');
  const safetyQuizzes = quizzes.filter(q => q.quizCategory === 'safety');

  const getQuizTitle = (quiz: Quiz) => {
    // For certification and safety quizzes, use translated titles based on documentType
    if ((quiz.quizCategory === 'certification' || quiz.quizCategory === 'safety') && quiz.documentType) {
      // Look up translation key based on documentType (e.g., irata_level_1_a, swp_window_cleaning)
      const translationKey = `quiz.titles.${quiz.documentType}`;
      const translated = t(translationKey, quiz.title || quiz.documentType);
      return translated;
    }
    // Company quizzes use documentType
    if (quiz.documentType) {
      return getDocumentTypeLabel(quiz.documentType);
    }
    // Fallback to title if available
    if (quiz.title) {
      return quiz.title;
    }
    return t('quiz.quiz', 'Quiz');
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'health_safety_manual':
        return t('quiz.healthSafetyManual', 'Health & Safety Manual');
      case 'company_policy':
        return t('quiz.companyPolicy', 'Company Policy');
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizResult(null);
  };

  const handleSelectAnswer = (questionNumber: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionNumber]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    const answersArray = questions.map(q => ({
      questionNumber: q.questionNumber,
      selectedAnswer: answers[q.questionNumber] || '',
    }));

    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', `/api/quiz/${selectedQuiz.id}/submit`, { answers: answersArray });
      const result = await response.json();
      setQuizResult(result);
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/available'] });
      queryClient.invalidateQueries({ queryKey: ['/api/csr'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit quiz",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizResult(null);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const renderQuizCard = (quiz: Quiz) => {
    const isCertQuiz = quiz.quizCategory === 'certification';
    const isSafetyQuiz = quiz.quizCategory === 'safety';
    const certBadgeColor = quiz.certification === 'irata' 
      ? 'bg-blue-600 text-white' 
      : 'bg-orange-600 text-white';
    
    const getSafetyBadgeColor = (category?: string) => {
      switch (category) {
        case 'swp': return 'bg-emerald-600 text-white';
        case 'flha': return 'bg-amber-500 text-white';
        case 'harness': return 'bg-purple-600 text-white';
        default: return 'bg-teal-600 text-white';
      }
    };
    
    const getSafetyCategoryLabel = (category?: string) => {
      switch (category) {
        case 'swp': return 'SWP';
        case 'flha': return 'FLHA';
        case 'harness': return 'Harness';
        default: return 'Safety';
      }
    };

    return (
      <div
        key={quiz.id}
        className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
        data-testid={`quiz-card-${quiz.id}`}
      >
        <div className={`p-3 rounded-lg ${isCertQuiz ? (quiz.certification === 'irata' ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-orange-50 dark:bg-orange-900/30') : isSafetyQuiz ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
          {isCertQuiz ? (
            <GraduationCap className={`h-5 w-5 ${quiz.certification === 'irata' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
          ) : isSafetyQuiz ? (
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{getQuizTitle(quiz)}</span>
            {isCertQuiz && quiz.certification && quiz.level && (
              <Badge className={certBadgeColor}>
                {quiz.certification.toUpperCase()} L{quiz.level}
              </Badge>
            )}
            {isSafetyQuiz && quiz.category && (
              <Badge className={getSafetyBadgeColor(quiz.category)}>
                {getSafetyCategoryLabel(quiz.category)}
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span>{quiz.questionCount} {t('quiz.questions', 'questions')}</span>
            {quiz.attemptCount > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span>{quiz.attemptCount} {t('quiz.attempts', 'attempts')}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {quiz.hasPassed ? (
            <Badge variant="default" className="bg-emerald-600 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t('quiz.completed', 'Completed')}
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => handleStartQuiz(quiz)}
              className="bg-[#0B64A3] hover:bg-[#0B64A3]/90 text-white"
              data-testid={`start-quiz-${quiz.id}`}
            >
              {quiz.attemptCount > 0 ? t('quiz.retry', 'Retry') : t('quiz.start', 'Start')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('quiz.safetyQuizzes', 'Safety Quizzes')}</h3>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('quiz.safetyQuizzes', 'Safety Quizzes')}</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('quiz.completeQuizzes', 'Complete quizzes to demonstrate your knowledge')}</p>
        </div>
        <div className="p-4 sm:p-5">
          <div className="text-center py-8">
            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <ClipboardList className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300">{t('quiz.noQuizzes', 'No quizzes available yet')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('quiz.checkBackLater', 'Check back later when your company uploads safety documents')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {certificationQuizzes.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('quiz.alignedWith', 'Aligned with IRATA & SPRAT training concepts')}</p>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('quiz.ropeAccessQuizzes', 'Rope Access Knowledge Quizzes')}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('quiz.testRopeAccess', 'Test your rope access knowledge with practice quizzes')}</p>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid gap-3">
                {certificationQuizzes.map(renderQuizCard)}
              </div>
            </div>
          </div>
        )}

        {safetyQuizzes.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('quiz.safetyPracticeQuizzes', 'Safety Practice Quizzes')}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('quiz.testSafetyKnowledge', 'Test your knowledge of Safe Work Procedures, FLHA, and harness inspections')}</p>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid gap-3">
                {safetyQuizzes.map(renderQuizCard)}
              </div>
            </div>
          </div>
        )}

        {companyQuizzes.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t('quiz.companyQuizzes', 'Company Safety Quizzes')}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('quiz.earnCsrPoints', 'Complete quizzes to demonstrate your knowledge and earn CSR points')}</p>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid gap-3">
                {companyQuizzes.map(renderQuizCard)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Taking Dialog */}
      <Dialog open={!!selectedQuiz && !quizResult} onOpenChange={(open) => !open && handleCloseQuiz()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuiz && getQuizTitle(selectedQuiz)}
              {selectedQuiz?.quizCategory === 'certification' && selectedQuiz.certification && selectedQuiz.level && (
                <Badge className={selectedQuiz.certification === 'irata' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'}>
                  {selectedQuiz.certification.toUpperCase()} L{selectedQuiz.level}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {t('quiz.answerAllQuestions', 'Answer all questions to the best of your ability. You need 80%')} ({Math.ceil(selectedQuiz?.questionCount ? selectedQuiz.questionCount * 0.8 : 16)}/{selectedQuiz?.questionCount || 20}) {t('quiz.toPass', 'to pass')}.
            </DialogDescription>
          </DialogHeader>

          {loadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('quiz.questionOf', 'Question')} {currentQuestionIndex + 1} {t('quiz.of', 'of')} {questions.length}
                  </span>
                  <span className="text-muted-foreground">
                    {answeredCount} {t('quiz.answered', 'answered')}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="space-y-4">
                <p className="text-lg font-medium">{currentQuestion.question}</p>
                <RadioGroup
                  value={answers[currentQuestion.questionNumber] || ''}
                  onValueChange={(value) => handleSelectAnswer(currentQuestion.questionNumber, value)}
                  className="space-y-3"
                >
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate">
                      <RadioGroupItem value={key} id={`option-${key}`} data-testid={`option-${key}`} />
                      <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">
                        <span className="font-semibold mr-2">{key}.</span>
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  data-testid="button-prev-question"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('quiz.previous', 'Previous')}
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      data-testid="button-next-question"
                    >
                      {t('quiz.next', 'Next')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting || answeredCount < questions.length}
                      data-testid="button-submit-quiz"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          {t('quiz.submitting', 'Submitting...')}
                        </>
                      ) : (
                        <>
                          {t('quiz.submitQuiz', 'Submit Quiz')}
                          <CheckCircle2 className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Unanswered warning */}
              {currentQuestionIndex === questions.length - 1 && answeredCount < questions.length && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">
                    {questions.length - answeredCount} {t('quiz.questionsUnanswered', 'questions unanswered')}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Quiz Results Dialog */}
      <Dialog open={!!quizResult} onOpenChange={(open) => !open && handleCloseQuiz()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {quizResult?.passed ? (
                <Trophy className="h-6 w-6 text-amber-500" />
              ) : (
                <XCircle className="h-6 w-6 text-destructive" />
              )}
              {quizResult?.passed ? t('quiz.passed', 'Quiz Passed') : t('quiz.notPassed', 'Quiz Not Passed')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Score Display */}
            <div className="text-center">
              <div className={`text-5xl font-bold ${quizResult?.passed ? 'text-green-600' : 'text-destructive'}`}>
                {quizResult?.score}%
              </div>
              <p className="text-muted-foreground mt-2">
                {quizResult?.correctAnswers} {t('quiz.outOf', 'out of')} {quizResult?.totalQuestions} {t('quiz.correct', 'correct')}
              </p>
            </div>

            {/* Result message */}
            <div className={`p-4 rounded-lg ${quizResult?.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
              {quizResult?.passed ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400">{t('quiz.congratulations', 'Congratulations!')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quiz.successfullyPassed', 'You have successfully passed this quiz.')}
                    </p>
                    {selectedQuiz?.quizCategory === 'company' && (
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                        {t('quiz.csrPointEarned', '+1 CSR Point earned for your company!')}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{t('quiz.notQuiteYet', 'Not quite there')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quiz.needToPass', 'You need 80%')} ({Math.ceil((quizResult?.totalQuestions || 20) * 0.8)}/{quizResult?.totalQuestions || 20}) {t('quiz.reviewAndRetry', 'to pass. Review the material and try again.')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCloseQuiz} className="w-full" data-testid="button-close-results">
              {quizResult?.passed ? t('quiz.done', 'Done') : t('quiz.close', 'Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
