import PageHeader from '../components/ui/PageHeader.jsx';
import PlaceholderBlock from '../components/ui/PlaceholderBlock.jsx';

export default function Premium() {
  return (
    <>
      <PageHeader
        title="Premium"
        subtitle="Unlock the AI Wealth Manager and more"
        badge="₹99/mo"
      />
      <PlaceholderBlock moduleNote="the Premium module" />
    </>
  );
}