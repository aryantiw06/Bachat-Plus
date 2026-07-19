import PageHeader from '../components/ui/PageHeader.jsx';
import PlaceholderBlock from '../components/ui/PlaceholderBlock.jsx';

export default function Profile() {
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your account details"
      />
      <PlaceholderBlock moduleNote="the Authentication module" />
    </>
  );
}