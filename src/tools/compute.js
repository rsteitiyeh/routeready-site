// VendingStartup - Vending Location Profit Calculator
// Contract: compute(values) -> { status: "<statusId>", outputs: { "<outputId>": { value, note? } } }
const DAYS_PER_MONTH = 30.4;

export function compute(v) {
  const salesPerDay = v.salesPerDay || 0;
  const avgPrice = v.avgPrice || 0;
  const productCostPct = v.productCostPct || 0;
  const commissionPct = v.commissionPct || 0;
  const machineCost = v.machineCost || 0;
  const visitsPerMonth = v.visitsPerMonth || 0;
  const costPerVisit = v.costPerVisit || 0;

  const grossRevenue = salesPerDay * avgPrice * DAYS_PER_MONTH;
  const productCost = grossRevenue * (productCostPct / 100);
  const commissionCost = grossRevenue * (commissionPct / 100);
  const visitCost = visitsPerMonth * costPerVisit;
  const netProfit = grossRevenue - productCost - commissionCost - visitCost;
  const paybackMonths = netProfit > 0 ? machineCost / netProfit : Infinity;

  let status;
  if (netProfit <= 0) status = 'bad';
  else if (paybackMonths > 24) status = 'warn';
  else status = 'ok';

  const money = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return {
    status,
    outputs: {
      gross: {
        value: money(grossRevenue),
        note: salesPerDay + ' sales/day x $' + avgPrice.toFixed(2) + ' x ' + DAYS_PER_MONTH.toFixed(1) + ' days'
      },
      net: {
        value: money(netProfit),
        note: 'after product cost, commission and restock visits'
      },
      payback: {
        value: isFinite(paybackMonths) ? paybackMonths.toFixed(1) + ' months' : 'Not profitable yet',
        note: 'to recoup a $' + machineCost.toLocaleString('en-US') + ' machine'
      }
    }
  };
}
