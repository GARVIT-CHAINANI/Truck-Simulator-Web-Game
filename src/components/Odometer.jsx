import styles from './Panel.module.css';

export default function Odometer({ dist }) {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>ODOMETER</div>
      <div style={{ fontSize: 20, color: '#FFB347', minWidth: 110, textAlign: 'center' }}>
        {dist} km
      </div>
    </div>
  );
}
