import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import React, { useState, ReactNode, useEffect } from "react";
import {
  browserSessionPersistence,
  getRedirectResult,
  setPersistence,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { ChackuserRegisterurl, GetNonceUrl } from "./EndPoints";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PowerSettingsNew } from "@mui/icons-material";
interface HeaderProps {
  children?: ReactNode;
}
export type User = {
  id: string;
  name: string;
  username: string;
  type: "local" | "twitter";
};
import { auth } from "../component/firbaseconfig";
import { log } from "console";
const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [openDrawer, setopenDrawer] = useState(false);
  const [viewMoreWallets, setViewMorewallets] = useState(false);
  const [nonce, setnonce] = useState("");

  const provider = new TwitterAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
    force_login: "true",
  });
  const { open, close } = useAppKit();
  const toggleMenu = () => {
    setopenDrawer(!openDrawer);
  };
  const { address, isConnected, status } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const {
    data: signMessageData,
    signMessage,
    variables,
    error,
  } = useSignMessage();
  const sendMessage = async (mess: any) => {
    await signMessage({ message: mess });
  };
  useEffect(() => {
    if (address && isConnected) {
      // GenrateRandomNumberApi();
      CheackUserRegsiter();
    }
  }, [address, isConnected]);
  const CheackUserRegsiter = async () => {
    axios({
      url: ChackuserRegisterurl + `?walletAddress=${address}`,
      method: "get",
    })
      .then((res) => {
        if (res?.data?.responseCode == 200) {
          if (res?.data?.result?.isFirstTime) {
            GenrateRandomNumberApi();
            setIsPopupOpen(false);
          } else {
            toast.success("Login Sucessfully.");
            setIsPopupOpen(false);
          }
        } else {
          setIsPopupOpen(false);
          setIsPopupOpen(false);
        }
      })
      .catch((err) => {
        toast.success("Login Sucessfully.");
        setIsPopupOpen(false);
      });
  };
  const GenrateRandomNumberApi = async () => {
    const data = {
      walletAddress: address,
    };
    axios({
      data: data,
      url: GetNonceUrl,
      method: "post",
    })
      .then((res) => {
        if (res?.data?.responseCode == 200) {
          if (res?.data?.result?.user?.isFirstTime) {
            sendMessage(res?.data?.result?.nonce);
            setnonce(res?.data?.result?.nonce);
            setIsPopupOpen(false);
          } else {
            // toast.success("Login Sucessfully.");
            setIsPopupOpen(false);
          }
        } else {
          setIsPopupOpen(false);
        }
      })
      .catch((err) => {
        toast.success("Login Sucessfully.");
        setIsPopupOpen(false);
      });
  };
  useEffect(() => {
    if (variables?.message && signMessageData && nonce) {
      (async () => {
        try {
          const recoveredAddress = await recoverMessageAddress({
            message: variables?.message,
            signature: signMessageData,
          });
          if (recoveredAddress) {
            LoginApi(signMessageData);
          }
        } catch (error) {
          console.error("Failed to recover address:", error);
        }
      })();
    }
  }, [signMessageData, variables?.message]);
  const LoginApi = async (signMessageData: any) => {
    const data = {
      walletAddress: address,
      signature: signMessageData,
      nonce: nonce,
    };
    axios({
      data: data,
      url: GetNonceUrl,
      method: "post",
    })
      .then((res) => {
        if (res?.data?.responseCode == 200) {
          console.log("====================================");
          console.log(res?.data);
          console.log("====================================");
          setIsPopupOpen(false);
          toast.success("Login Sucessfully.");
        } else {
          setIsPopupOpen(false);
        }
      })
      .catch((err) => {
        toast.success("Login failed!");
        setIsPopupOpen(false);
      });
  };

  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: function (user: any) {
        fetch("https://1ab4-103-110-243-194.ngrok-free.app/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Logged in:", data);
          });
      },
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "fetchDataOfUsersBot");
    script.setAttribute("data-size", "small");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");

    const container = document.getElementById("telegram-button");
    if (container) {
      container.appendChild(script);
    }
  }, []);

  const initiateTwitterLogin = () => {
    // Open Twitter auth in same tab
    window.location.href =
      "https://a6f7-103-174-166-30.ngrok-free.app/auth/twitter";
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Logo</div>
        <ul className={`nav-links ${openDrawer ? "show" : ""}`}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        {address ? (
          <PowerSettingsNew
            fontSize="medium"
            onClick={() => disconnect()}
            style={{ color: "#fff", cursor: "pointer", margin: "10px" }}
          />
        ) : (
          <button className="login-btn" onClick={() => setIsPopupOpen(true)}>
            Login
          </button>
        )}

        <button className="menu-btn" onClick={() => toggleMenu()}>
          ☰
        </button>
      </nav>
      <div
        className="popup"
        id="loginPopup"
        style={{ display: isPopupOpen ? "block" : "none" }}
      >
        <span className="close-btn" onClick={() => setIsPopupOpen(false)}>
          &times;
        </span>
        <h2>Login</h2>
        <p>With social media account</p>
        <div className="social-login">
          <div className="social-icons" onClick={() => initiateTwitterLogin()}>
            <img src="./assets/images/social-media(1).png" alt="" />
          </div>
          <div className="social-icons">
            <img src="./assets/images/discord(1).png" alt="" />
          </div>
          <div className="social-icons">
            <img
              src="./assets/images/telegram.png"
              alt=""
              id="telegram-button"
            />
          </div>
          <div className="social-icons">
            <img src="./assets/images/message.png" alt="" />
          </div>
        </div>
        <p>With wallet</p>
        <div className="wallets">
          <div className="wallets-div">
            <div className="wallet-card" onClick={() => open()}>
              <img src="./assets/images/metamask-removebg-preview.png" alt="" />
              <p>MetaMask</p>
            </div>
            <div className="wallet-card">
              <img
                src="./assets/images/walletconn-removebg-preview.png"
                alt=""
              />
              <p>WalletConnect</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/bitget-token-new-bgb-logo.png" alt="" />
              <p>Bitget Wallet</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/tron-removebg-preview.png" alt="" />
              <p>TronLink</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/okx.png" alt="" />
              <p>OKX Wallet</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/okx.png" alt="" />
              <p>OKX Wallet BTC</p>
            </div>
          </div>
        </div>
        <p
          className="more"
          onClick={() => setViewMorewallets(!viewMoreWallets)}
        >
          More<i className="fa-solid fa-chevron-down"></i>
        </p>

        <div
          className="extra-wallets"
          id="extraWallets"
          style={{ display: viewMoreWallets ? "block" : "none" }}
        >
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/phantom.jpeg" alt="" />
              <p>Phantom</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/unisat.png" alt="" />
              <p>Unisat</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/braavos.jpeg" alt="" />
              <p>Braavos</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/images (2).png" alt="" />
              <p>ONTO</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/fsl.png" alt="" />
              <p>FSL ID</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/petra.png" alt="" />
              <p>Petra Aptos</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/suo.webp" alt="" />
              <p>Sui Wallet</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/suiet.jpeg" alt="" />
              <p>Suiet</p>
            </div>
          </div>
          <div className="wallets-div">
            <div className="wallet-card">
              <img src="./assets/images/martian_wallet_logo.jpeg" alt="" />
              <p>Martian</p>
            </div>
            <div className="wallet-card">
              <img src="./assets/images/leapwallet_logo.jpeg" alt="" />
              <p>Leap</p>
            </div>
          </div>
        </div>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span>
            I agree to the <a href="#">Terms of Service</a> and
            <a href="#"> Privacy Policy</a>
          </span>
        </label>
      </div>
      {children} {/* Render children here */}
    </header>
  );
};

export default Header;
