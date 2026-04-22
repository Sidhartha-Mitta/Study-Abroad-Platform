import ProgressBar from '../ui/ProgressBar'

export default function RecommendationScore({ score = 0, total = 8 }) {
  const pct = score > 1 ? (score / total) * 100 : score * 100
  return <ProgressBar value={Math.min(100, pct)} label={`Relevance ${score}/${total}`} />
}
