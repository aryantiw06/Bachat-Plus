import PageHeader from '../components/ui/PageHeader.jsx';
import PlaceholderBlock from '../components/ui/PlaceholderBlock.jsx';

export default function Wallet() {
  return (
    <>
      <PageHeader
        title="Wealth Wallet"
        subtitle="Every round-up you've saved, in one place"
      />
      <PlaceholderBlock moduleNote="the Round-Up Engine module" />
    </>
  );
}