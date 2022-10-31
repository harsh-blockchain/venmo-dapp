import { ChevronDownIcon } from "@heroicons/react/outline";
import styles from "../styles/Navbar.module.css";
import { TransactionContext } from "../context.js/Context";
import { useContext } from "react";

const Navbar = () => {
  const { connectWallet, currentAccount } = useContext(TransactionContext);

  return (
    <nav className={styles.navigationContainer}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img
            className={styles.logoImage}
            src="https://assets.stickpng.com/thumbs/5e8ce533664eae000408546a.png"
            alt="Venmo Logo"
          />
        </div>

        {currentAccount ? (
          <div className={styles.actionsContainer}>
            <p>
              Hello,{" "}
              <span className={styles.accentColor}>
                {currentAccount}
              </span>
              ! 👋
            </p>

            <ChevronDownIcon className={styles.arrowDownIcon} />
            <div className={styles.avatarContainer}>
              <img
                className={styles.avatarImage}
                src="https://yeeqiang.me/avatar.jpeg"
                alt=""
              />
            </div>
          </div>
        ) : (
          <button className={styles.connectBtn} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;