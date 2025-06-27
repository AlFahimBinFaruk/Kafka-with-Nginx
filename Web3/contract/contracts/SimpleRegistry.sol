// SPDX‑License‑Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleRegistry {
    // Define events with indexed and non-indexed parameters
    event Registered(address indexed user, uint256 indexed id, string metadata);
    event Updated(uint256 indexed id, string oldMeta, string newMeta);
    event Removed(uint256 indexed id, address executor);

    struct Entry {
        address user;
        string metadata;
    }

    mapping(uint256 => Entry) public entries;
    uint256 public nextId;

    // Register a new entry
    function register(string calldata metadata) external {
        uint256 id = nextId++;
        entries[id] = Entry({ user: msg.sender, metadata: metadata });
        emit Registered(msg.sender, id, metadata);
    }

    // Update an existing entry
    function update(uint256 id, string calldata newMeta) external {
        Entry storage e = entries[id];
        require(e.user == msg.sender, "not owner");
        string memory oldMeta = e.metadata;
        e.metadata = newMeta;
        emit Updated(id, oldMeta, newMeta);
    }

    // Remove an entry
    function remove(uint256 id) external {
        Entry storage e = entries[id];
        require(e.user == msg.sender, "not owner");
        delete entries[id];
        emit Removed(id, msg.sender);
    }
}
