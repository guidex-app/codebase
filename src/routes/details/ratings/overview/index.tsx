import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { sumOf } from '../../../../helper/array';
import { getPerfectNumber } from '../../../../helper/number';
import style from './style.module.css';

interface OverviewProps {
  rating: [number, number, number, number, number]
}

const VisuellOverview: FunctionalComponent<OverviewProps> = ({ rating }: OverviewProps) => {
  const [ratingStats, setRatingStats] = useState<{
    totalCount: number;
    amount: number;
    currentRatings: [number, number, number, number, number];
  }>({ totalCount: 0, amount: 0, currentRatings: rating });

  useEffect(() => {
    if (rating.length === 5) {
      setRatingStats({
        currentRatings: rating,
        amount: sumOf(rating),
        totalCount: rating.reduce((a, b, index: number) => a + (b * (index + 1)), 0),
      });
    }
  }, [rating]);

  return (
    <div class={style.overview}>
      <div>
        <h1><strong>{ratingStats.amount > 0 ? getPerfectNumber(ratingStats.totalCount / ratingStats.amount) : 0} / 5</strong></h1>
        <p style={{ color: 'var(--fifth)' }}><small>({ratingStats.amount}) Bewertungen</small></p>
      </div>

      <table>
        <tbody>
          {ratingStats.currentRatings.map((star: number, index: number) => (
            <tr>
              <td class={`${style.stars}`} style={{ color: 'var(--orange)' }}>
                <span>★</span>
                {index >= 1 && <span>★</span>}
                {index >= 2 && <span>★</span>}
                {index >= 3 && <span>★</span>}
                {index >= 4 && <span>★</span>}
                &nbsp;({index + 1})
              </td>
              <td class={style.percent}><span><span style={{ width: `${(star / (ratingStats.amount || 1)) * 100}%` }} /></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisuellOverview;
