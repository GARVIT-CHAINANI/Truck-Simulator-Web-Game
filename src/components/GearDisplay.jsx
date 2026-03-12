import styles from './Panel.module.css';

export default function GearDisplay({ gear }) {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>GEAR</div>
      <div style={{ fontSize: 34, fontWeight: 'bold', color: '#FFB347', minWidth: 54, textAlign: 'center' }}>
        {gear}
      </div>
    </div>
  );
}
