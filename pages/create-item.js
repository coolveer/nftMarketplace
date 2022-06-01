import {useEffect,useState} from "react";
import {ethers} from "ethers";
import { create as  ipfsHttpClient } from 'ipfs-http-client';
import {useRouter} from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress,nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"


export default function CreateItem () {
    const [Url, setUrl] = useState(null);
    const [formInput, setFormInput] = useState({price:"",name:'',description:""})

    const router = useRouter();

    const onChange = async (e) => {
        const file = e.target.files[0];
        try {
            const added = await client.add(file,{
                progress:(prog) => console.log('received : ',prog)
            });
            
            const addedUrl = `https://ipfs.infura.io/ipfs/${added.path}`

            setUrl(addedUrl)
            
        } catch (error) {
            console.log("erroe",error);
        }
    }

    const createItem = async () =>  {
        const {name,price,description} =formInput;
        if (!name || !price || !description || !Url) {
            return
        }
        const data = JSON.stringify({name, description,image:Url});
        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createSale(url)
        } catch (error) {
            console.log("error",error);
        }

    }

    const createSale = async (url) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(nftaddress,NFT.abi,signer);
        let transection = await contract.createToken(url);
        let tx = await transection.wait()

        let event =tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price,"ether");
        contract = new ethers.Contract(nftmarketaddress,Market.abi,signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();

        transection = await contract.createMarketItem(
            nftaddress,tokenId,price, {value:listingPrice}
        );

        // await transection.await();
        router.push("/");
    }



    return (
        <div className="flex justify-center">
            <div className=" w-1/2 flex flex-col pb-12">
                <input type="text" className="mt-8 border rounded p-4" placeholder="Asset Name" onChange={e => setFormInput({...formInput,name:e.target.value})} />
                <textarea cols="30" rows="10" placeholder="asset description " className="mt-2 border rounded p-4"  onChange={e => setFormInput({...formInput,description:e.target.value})} ></textarea>
                <input type="text" className="mt-2 border rounded p-4" placeholder="price"  onChange={e => setFormInput({...formInput,price:e.target.value})} />
                <input type="file" name="Asset" className="my-4" onChange={onChange} />
                {
                    Url && (<img className="rounded mt-4 " width='350' src={Url} />)
                }
                <button onClick={createItem} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" >
                    Create digital asset 
                </button>
            </div>
        </div>
    )
}
