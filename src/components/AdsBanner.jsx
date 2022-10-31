import styles from "../styles/AdsBanner.module.css";

function AdsBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerEmojis}>🚀 🧠 🧑‍💻</div>
        <h3 className={styles.bannerTitle}>Web3 Space</h3>
        <p className={styles.bannerDescription}>
          Biggest Companies Are Powered by aspiring Web3 techs just like venmo 💪
        </p>

        <div className={styles.bannerCta}>
          <button className={styles.ctaButton} type="button">
            <img
              className={styles.ctaButtonImage}
              src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Google_Play_Store_badge_FR.svg"
              alt="Download on the App Store"
            />
          </button>

          <button className={styles.ctaButton} type="button">
            <img
              className={styles.ctaButtonImage}
              src="https://logos-download.com/wp-content/uploads/2016/06/Download_on_the_App_Store_logo.png"
              alt="Get it on Google Play"
            />
          </button>
        </div>
      </div>

      
    </div>
  );
}

export default AdsBanner;