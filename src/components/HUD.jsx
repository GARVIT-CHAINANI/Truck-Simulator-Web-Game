import Odometer    from './Odometer';
import Speedometer  from './Speedometer';
import GearDisplay  from './GearDisplay';

export default function HUD({ kmh, gear, dist }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'flex-end',
      gap: 24,
      pointerEvents: 'none',
    }}>
      <Odometer   dist={dist} />
      <Speedometer kmh={kmh} />
      <GearDisplay gear={gear} />
    </div>
  );
}
