// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SoulboundNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    IERC20 public usdc;
    uint256 public price = 5 * 10 ** 6; // 5 USDC, 6 decimals

    constructor(address usdcAddress) ERC721("ArcSoulbound", "ASBT") {
        usdc = IERC20(usdcAddress);
    }

    // Public minting function — anyone with USDC can call
    function mint(string memory tokenURI) public {
        require(usdc.transferFrom(msg.sender, address(this), price), "Payment failed");

        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

    // Soulbound: prevent transfers
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Soulbound: cannot transfer");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}