//Service Provider
const serverUrl = "https://9u6c8mkecbej.usemoralis.com:2053/server";
const appId = "eR98aghbIcArA9Wfhh86INVnCk0M04Y96FviHdRJ";
Moralis.start({ serverUrl, appId });

console.log("window.location", window.location.pathname);

window.onload = () => {
  document.getElementById("btn-nftsSelected").style.visibility = "hidden";
  let user = Moralis.User.current();
    console.log("user", user);
    if(user){
        document.getElementById("btn-login").style.visibility = "hidden";
        document.getElementById("btn-logout").style.visibility = "visible";
        getNFTs();
        generateTable();
    }
    if(!user){
      document.getElementById("btn-login").style.visibility = "visible";
      document.getElementById("btn-logout").style.visibility = "hidden";
    }
};

//Authentication
const login = async () => {
    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({
                signingMessage: "Connect Whoopdoop to MetaMask",
            })
            .then(function(user) {
                console.log("logged in user:", user);
                console.log(user.get("ethAddress"));
                document.getElementById("btn-login").style.visibility = "hidden";
                document.getElementById("btn-logout").style.visibility = "visible";
                waitForAddress();
                getNFTs();
            })
            .catch(function(error) {
                console.log(error);
                alert(error.message);``
            });
    }
    setTimeout(function() {
        let user = Moralis.User.current();
        if(user){
            alert("Wallet Connected");
        }
    }, 400);
}
  
const logOut = async () => {
    await Moralis.User.logOut();
    console.log("logged out");
    setTimeout(function(){
        document.getElementById("btn-logout").style.visibility = "hidden";
        document.getElementById("btn-login").style.visibility = "visible";
   }, 400);
}
  
  
//Waits for the current user's ethereum address to be fetched
var currentUserAddress = "";
const addressGrabber = async () => {
    let currentUser = Moralis.User.current();
    if(currentUser){
        currentUserAddress = currentUser.attributes.ethAddress;
        return currentUserAddress;
    }
}
const waitForAddress = async() => {
    let t = await addressGrabber();
    console.log("address fetched successfully");
    getNFTs();
}

console.log(currentUserAddress);

document.getElementById("btn-logout").addEventListener('click', () => {
  logOut();
  setTimeout(function() {
      alert("Wallet disconnected");
  }, 800);
});
document.getElementById("btn-login").addEventListener('click', () => {
  login();
});


var ethNFTsImagesIPFS = []; //array of IPFS urls
var ethNFTsContentIDs = []; //array of content IDs
var ethNFTsImagesURLs = []; //array of NFT images


// ===================TEMPORARY============
const ethNFTs = [
    {
    "name": "Wenolin",
    "description": "test1",
    "image": "ipfs://QmVZqAEa8BUQd8qmTfXgZfzRdptzNFMEGxFr2Aifixe56V/1.png",
    "animation_url": "ipfs://QmcoAe8mixqscd6PTommSZpFF1oh46wgu1hX4x1gy5dYKG/1.glb",
    "attributes": [
      {
        "trait_type": "House",
        "value": "Alucar"
      },

      {
        "trait_type": "Type",
        "value": "Sword"
      },

      {
        "trait_type": "Rarity",
        "value": "Standard"
      },

      {
        "trait_type": "Edition",
        "value": "First Edition"
      }
    ]
    },
    {
        "name": "Wenolin",
        "description": "test1",
        "image": "ipfs://QmVZqAEa8BUQd8qmTfXgZfzRdptzNFMEGxFr2Aifixe56V/1.png",
        "animation_url": "ipfs://QmcoAe8mixqscd6PTommSZpFF1oh46wgu1hX4x1gy5dYKG/1.glb",
        "attributes": [
          {
            "trait_type": "House",
            "value": "Alucar"
          },
    
          {
            "trait_type": "Type",
            "value": "Sword"
          },
    
          {
            "trait_type": "Rarity",
            "value": "Standard"
          },
    
          {
            "trait_type": "Edition",
            "value": "First Edition"
          }
        ]
        }
]
console.log(ethNFTs);
//=========================================


const getNFTs = async() => {
  const packet = { chain: "eth", address: currentUserAddress, token_address: "0x565AbC3FEaa3bC3820B83620f4BbF16B5c4D47a3" };
  //const ethNFTs = await Moralis.Web3API.account.getNFTsForContract(packet);
  for(let i = 0; i < ethNFTs.length; i++) {
    ethNFTsImagesIPFS.push(ethNFTs[i].image);
  }
  console.log("ethNFTsImagesIPFS", ethNFTsImagesIPFS);
  for(let i = 0; i < ethNFTsImagesIPFS.length; i++){
    let temp = ethNFTsImagesIPFS[i];
    let tempIDs = temp.substring(7);
    ethNFTsContentIDs.push(tempIDs);
    console.log(ethNFTsImagesURLs);
    
    ethNFTsImagesURLs.push(`https://ipfs.io/ipfs/${ethNFTsContentIDs[i]}`);
    
    console.log(ethNFTsImagesURLs[i]);
  }
  
  if(ethNFTsImagesURLs.length == 0){
    alert("No NFTs found");
  }
  else{
    document.getElementById("btn-nftsSelected").style.visibility = "visible";
  }
  generateTable();
}

var selectedImages = [];

//TODO: Fix not every image being selectable
const generateTable = () => {
  for(let i = 0; i < ethNFTsImagesURLs.length; i++){
    let imageContainer = document.getElementById("image-container");
    let image = imageContainer.appendChild(document.createElement("li"));
    image.innerHTML = "<li><input type=\"checkbox\" id=\"cb" + (i) + "\" /><label for=\"cb" +(i)+ "\"><img src=\"" + ethNFTsImagesURLs[i] +"\" /></label></li>";
    let checkbox = document.getElementById("cb" + (i));
    checkbox.addEventListener( 'change', function() {
      if(this.checked) {
        selectedImages.push(ethNFTsImagesURLs[i]);
        console.log("item selected", selectedImages);
      } else {
        for(let j = 0; j < selectedImages.length; j++) {
          if(selectedImages[j] == ethNFTsImagesURLs[i]) {
            selectedImages.splice(j, 1);
            console.log("item removed", selectedImages);
          }
        }
      }
    });    
  }
}

let next1 = document.getElementById("btn-nftsSelected");
next1.addEventListener('click', () => {
  if(selectedImages.length == 0){
    alert("Please select at least one NFT");
  }
  else{
    storeSelectedImages();
    storeUserAddress();
    window.location.replace("selectMerch.html");
  }
});

console.log("selectedImages", selectedImages);

//Store selected images in cookies
const storeSelectedImages = () => {
    document.cookie = "selectedNFTs=" + JSON.stringify(selectedImages);
}

//Store user address in cookies
const storeUserAddress = () => {
  document.cookie = "userAddress=" + JSON.stringify(currentUserAddress);
}

console.log("userAddress", document.cookie);