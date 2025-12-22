import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";

export default function DashboardCustomizationGuide() {
  return (
    <ChangelogGuideLayout
      title="Dashboard Customization"
    >
      <section>
        <h2>What You Can Do</h2>
        <ul>
          <li>Add new cards from a library of available widgets</li>
          <li>Remove cards you do not need</li>
          <li>Drag and drop cards to reorder your layout</li>
          <li>Save your layout for persistence across sessions</li>
        </ul>
      </section>
      
      <section>
        <h2>Getting Started</h2>
        <p>
          Click the <strong>Customize</strong> button in the top-right corner of your dashboard 
          to enter edit mode. From there, you can add cards using the Add Card button, 
          drag cards to reorder them, or click the X to remove unwanted cards.
        </p>
      </section>
      
      <section>
        <h2>Tips</h2>
        <ul>
          <li>Start with minimal cards and add more as needed</li>
          <li>Group related cards together for easy scanning</li>
          <li>Use Reset to return to the default layout at any time</li>
        </ul>
      </section>
    </ChangelogGuideLayout>
  );
}
