import PageHeader from '../components/ui/PageHeader.jsx';
import PlaceholderBlock from '../components/ui/PlaceholderBlock.jsx';

export default function Investments() {
  return (
    <>
      <PageHeader
        title="Investments"
        subtitle="ETFs, Mutual Funds, Stocks, Gold & more"
      />
      <PlaceholderBlock moduleNote="the Investment module" />
    </>
  );
}