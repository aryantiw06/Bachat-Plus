import PageHeader from '../components/ui/PageHeader.jsx';
import PlaceholderBlock from '../components/ui/PlaceholderBlock.jsx';

export default function AIAdvisor() {
  return (
    <>
      <PageHeader
        title="AI Advisor"
        subtitle="Personalized investment recommendations"
        badge="AI"
      />
      <PlaceholderBlock moduleNote="the AI Layer module" />
    </>
  );
}