import { ethers } from "ethers";
import { useState,useEffect,createContext } from "react";
import { MigrationABI, MigrationAddress } from "../utils/Migration";
import { TransactionABI, TransactionAddress } from "../utils/Transaction";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')





export const TransactionContext = createContext();


const {ethereum} = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TransactionAddress, TransactionABI, signer);

    return contract;
}





export const TransactionProvider = ({children}) => {


    const [addressTo, setAddressTo] = useState('');
    const [amount, setAmount] = useState(0);
    const[message,setMessage] = useState('');
    const[currentAccount,setCurrentAccount] = useState('');
    const[isLoading,setIsLoading] = useState(false);
    const[transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const [Transactions, setTransactions] = useState([]);


    const checkIfWalletIsConnected = async () => {
        try{

            if(!ethereum){console.log('Make sure you have metamask!');return;}

            const accounts = await ethereum.request({method: 'eth_accounts'});
            if(accounts.length !== 0){
                setCurrentAccount(accounts[0]);

                getAllTransactions()
            }else{
                console.log('No authorized account found');
            }

        }catch(error){
            console.log(error);
        }
    }




    const connectWallet = async () => {
        try{
            if(!ethereum){alert('Get metamask');return;}

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log('Connected',accounts[0]);
            setCurrentAccount(accounts[0]);
            window.location.reload();

            getAllTransactions()
        }catch(error){
            console.log(error);
        }
    }



    const getAllTransactions = async () => {
        try{

            if (ethereum) {
                const transactionsContract = createEthereumContract()
        
                const availableTransactions =
                  await transactionsContract.getAllTransactions()
        
                const structuredTransactions = availableTransactions.map(
                  transaction => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: timeAgo.format(
                      new Date(transaction.timestamp.toNumber() * 1000),
                      'mini',
                    ),
                    message: transaction.message,
        
                    amount: parseInt(transaction.amount._hex) / 10 ** 18,
                  }),
                )
        
                console.log(structuredTransactions)
        
                setTransactions(structuredTransactions)
              } else {
                console.log('Ethereum is not present')
              }
            

        }catch(error){
            console.log(error);
        }
    }



    const sendTransaction = async() => {
        try {

            if(ethereum){
                const transactionContract = createEthereumContract();

                const parseAmount = ethers.utils.parseEther(amount);


                await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: currentAccount,
                        to: addressTo,
                        gas: '0x5208',
                        value: parseAmount._hex,

                    }]
                })


                const transactionHash = await transactionContract.addToBlockchain(addressTo,parseAmount,message);


                setIsLoading(true);
                
                console.log(`Loading - ${transactionHash.hash}`);

                await transactionHash.wait();

                console.log(`Success - ${transactionHash.hash}`);

                setIsLoading(false);

                const transactionCount = await transactionContract.getTransactionCount();

                setTransactionCount(transactionCount.toNumber());

                window.location.reload();
            }
            
        } catch (error) {
            console.log(error);
        }
            
        }


        const checkIfTransactionExist = async() => {
            try{

                if(!ethereum) return alert('Get metamask');

                const transactionContract = createEthereumContract();

                const currrentTransactionCount = await transactionContract.getTransactionCount();

                window.localStorage.setItem('transactionCount',currrentTransactionCount);

            }catch(error){
                console.log(error);
            }
        }
    
        useEffect(() => {
            checkIfWalletIsConnected()
            checkIfTransactionExist()
          }, [transactionCount])



    return(
        <TransactionContext.Provider value={{
            transactionCount,
        connectWallet,
        Transactions,
        currentAccount,
        isLoading,
        sendTransaction,

        setAmount,
        addressTo,
        amount,
        message,
        setMessage,
        setAddressTo,
        }}>
            {children}
        </TransactionContext.Provider>
    )
}

