export function calculateCompoundInvestment({
  initialAmount,
  monthlyContribution = 0,
  annualReferenceRate,
  percentageOfReference,
  months = 12,
}) {
  const principal = Number(initialAmount || 0)
  const contribution = Number(monthlyContribution || 0)
  const referenceRate = Number(annualReferenceRate || 0)
  const percentage = Number(percentageOfReference || 0)
  const totalMonths = Math.max(1, Number(months || 12))

  const annualRate = (referenceRate / 100) * (percentage / 100)
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1

  let balance = principal
  const timeline = []

  for (let month = 1; month <= totalMonths; month += 1) {
    balance = (balance + contribution) * (1 + monthlyRate)

    timeline.push({
      month,
      balance,
      contributionTotal: principal + contribution * month,
      gain: balance - (principal + contribution * month),
    })
  }

  const totalContributed = principal + contribution * totalMonths
  const finalBalance = timeline.at(-1)?.balance ?? principal

  return {
    annualRate,
    monthlyRate,
    totalContributed,
    finalBalance,
    projectedGain: finalBalance - totalContributed,
    timeline,
  }
}
