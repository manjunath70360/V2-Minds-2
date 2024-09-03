import React, { Component } from "react";
import "./index.css";
import { RiBrush2Fill, RiFolderOpenFill, RiArrowRightSLine } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { LuFileText } from "react-icons/lu";
import { IoMdArrowDropright } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const filesAndFolders = [
    {
        id: 1,
        name: 'Music',
        isSubFolderVisible: false,
        isFolder: true,
        path: '/Music',
        date: '2016/04/05 11:56:42 AM',
        subFolder: [
            { id: 'dummyId1', isFolder: false, name: 'dummyFile1.srt', size: '22KB', date: "2016/04/05 11:56:42 AM" },
            { id: 'dummyId2', isFolder: false, name: 'dummyFile2.srt', size: '40KB', date: "2016/04/05 11:56:42 AM" },
        ]
    },
    {
        id: 2,
        name: 'Photos',
        isSubFolderVisible: false,
        isFolder: true,
        path: '/Photos',
        date: '2016/03/26 6:04:26 PM',
        subFolder: [
            { id: 'dummyId3', isFolder: false, name: 'dummyFile3.srt', size: '11KB', date: "2016/04/05 11:56:42 AM" },
            { id: 'dummyId4', isFolder: false, name: 'dummyFile4.srt', size: '10KB', date: "2016/04/05 11:56:42 AM" }
        ]
    },
    {
        id: 3,
        name: 'Public',
        isSubFolderVisible: false,
        isFolder: true,
        path: '/Public',
        date: '2015/08/11 12:38:42 PM',
        subFolder: [
            { id: 'dummyId5', isFolder: false, name: 'dummyFile5.srt', size: '28KB', date: "2016/04/05 11:56:42 AM" },
            { id: 'dummyId6', isFolder: false, name: 'dummyFile6.srt', size: '46KB', date: "2016/04/05 11:56:42 AM" }
        ]
    },
    {
        id: 4,
        name: 'Shared',
        isSubFolderVisible: false,
        isFolder: true,
        path: '/Shared',
        date: '2015/05/26 6:11:00 PM',
        subFolder: [
            { id: 'dummyId7', isFolder: false, name: 'dummyFile7.srt', size: '11KB', date: "2016/04/05 11:56:42 AM" },
            { id: 'dummyId8', isFolder: false, name: 'dummyFile8.srt', size: '10KB', date: "2016/04/05 11:56:42 AM" }
        ]
    },
    
];

class Home extends Component {
    state = {
        files: filesAndFolders,
        currentPath: '',
        ispPathVisible: false,
        selectedItems: [], 
        div2SelectedItems: [] 
    };

  
    // Toggle visibility of subfolders
    toggleSubFolder = (id) => {
        this.setState(prevState => {
            const updatedFiles = prevState.files.map(file => 
                file.id === id ? { ...file, isSubFolderVisible: !file.isSubFolderVisible } : file
            );
    
            let currentPath = '';
            let ispPathVisible = false;
    
            // Find the current folder name and construct the path
            updatedFiles.forEach(file => {
                if (file.id === id) {
                    currentPath = file.name;
                    ispPathVisible = file.isSubFolderVisible;
                }
                file.subFolder.forEach(subItem => {
                    if (subItem.id === id) {
                        currentPath = `${file.name}/${subItem.name}`;
                        ispPathVisible = true; // Always show path when clicking on a subfolder
                    }
                });
            });
    
            return {
                files: updatedFiles,
                currentPath,
                ispPathVisible
            };
        });
    }

    // Handle selection of items in Division 1
    onSelectItems = (item, selectAll = false) => {
        this.setState(prevState => {
            let updatedSelectedItems = [...prevState.selectedItems];
    
            if (selectAll) {
                if (prevState.selectedItems.length === prevState.files.length) {
                    // Deselect all
                    updatedSelectedItems = [];
                } else {
                    // Select all
                    updatedSelectedItems = prevState.files.reduce((acc, file) => {
                        acc.push(`folder-${file.id}`);
                        file.subFolder.forEach(subItem => acc.push(`file-${subItem.id}`));
                        return acc;
                    }, []);
                }
            } else {
                const itemId = item.isFolder ? `folder-${item.id}` : `file-${item.id}`;
                const isItemSelected = updatedSelectedItems.includes(itemId);
    
                if (item.isFolder) {
                    if (isItemSelected) {
                        updatedSelectedItems = updatedSelectedItems.filter(id => id !== itemId);
                        item.subFolder.forEach(subItem => {
                            updatedSelectedItems = updatedSelectedItems.filter(id => id !== `file-${subItem.id}`);
                        });
                    } else {
                        updatedSelectedItems.push(itemId);
                        item.subFolder.forEach(subItem => {
                            updatedSelectedItems.push(`file-${subItem.id}`);
                        });
                    }
                } else {
                    updatedSelectedItems = isItemSelected
                        ? updatedSelectedItems.filter(id => id !== itemId)
                        : [...updatedSelectedItems, itemId];
    
                    const parentFolder = prevState.files.find(file => file.subFolder.some(sub => sub.id === item.id));
                    if (parentFolder) {
                        const allSubItemsSelected = parentFolder.subFolder.every(subItem =>
                            updatedSelectedItems.includes(`file-${subItem.id}`)
                        );
                        if (!allSubItemsSelected) {
                            updatedSelectedItems = updatedSelectedItems.filter(id => id !== `folder-${parentFolder.id}`);
                        }
                        if (allSubItemsSelected && !updatedSelectedItems.includes(`folder-${parentFolder.id}`)) {
                            updatedSelectedItems.push(`folder-${parentFolder.id}`);
                        }
                    }
                }
            }
    
            return {
                selectedItems: updatedSelectedItems
            };
        });
    }
    


    // Handle selection of items in Division 2
    onSelectDiv2Items = (item, selectAll = false) => {
        this.setState(prevState => {
            let updatedDiv2SelectedItems = [...prevState.div2SelectedItems];
    
            if (selectAll) {
                if (prevState.div2SelectedItems.length === prevState.selectedItems.length) {
                    // Deselect all
                    updatedDiv2SelectedItems = [];
                } else {
                    // Select all
                    updatedDiv2SelectedItems = prevState.selectedItems;
                }
            } else {
                const itemId = item.isFolder ? `folder-${item.id}` : `file-${item.id}`;
                const isItemSelected = updatedDiv2SelectedItems.includes(itemId);
    
                if (isItemSelected) {
                    updatedDiv2SelectedItems = updatedDiv2SelectedItems.filter(id => id !== itemId);
                } else {
                    updatedDiv2SelectedItems.push(itemId);
                }
            }
    
            return {
                div2SelectedItems: updatedDiv2SelectedItems
            };
        });
    }
    

    // Remove items from Division 2
    onRemoveFromDiv2 = () => {
        this.setState(prevState => {
            const updatedSelectedItems = new Set(prevState.selectedItems);
            const updatedDiv2SelectedItems = new Set(prevState.div2SelectedItems);

            updatedDiv2SelectedItems.forEach(itemId => {
                if (itemId.startsWith("folder-")) {
                    updatedSelectedItems.delete(itemId);
                    const folderId = parseInt(itemId.replace("folder-", ""));
                    const folder = prevState.files.find(file => file.id === folderId);
                    folder.subFolder.forEach(subItem => updatedSelectedItems.delete(`file-${subItem.id}`));
                } else if (itemId.startsWith("file-")) {
                    updatedSelectedItems.delete(itemId);
                    const parentFolder = prevState.files.find(file => file.subFolder && file.subFolder.some(sub => `file-${sub.id}` === itemId));
                    if (parentFolder) {
                        const allSubItemsSelected = parentFolder.subFolder.every(subItem => updatedSelectedItems.has(`file-${subItem.id}`));
                        if (!allSubItemsSelected) updatedSelectedItems.delete(`folder-${parentFolder.id}`);
                    }
                }
            });

            return {
                selectedItems: Array.from(updatedSelectedItems),
                div2SelectedItems: []
            };
        });
    };

    

    render() {
        const { files, currentPath, ispPathVisible, selectedItems, div2SelectedItems } = this.state;

        return (
            <div className="app-container">
                <div className="home-icon">
                    <button className="home-btn"><FaHome className="icon-home" size={12} /></button>
                    <div className="path-con">
                        <p className="home">Home</p>
                        {ispPathVisible && <>
                            <IoMdArrowDropright className="path-icon" />
                            <p className="home">{currentPath}</p>
                        </>}
                    </div>
                </div>
                <div className="div-one">
                    <div className="folder-header">
                        <div className="folder-action-btns">
                            <button className="icon-btn">
                                <RiBrush2Fill className="icon" />
                            </button>
                            <p className="action-name">Archive Cleanup</p>
                        </div>
                        <div className="folder-action-btns">
                            <button className="icon-btn">
                                <BiSearch className="icon" />
                            </button>
                            <p className="action-name">Search</p>
                        </div>
                        <div className="folder-action-btns last-action">
                            <button className="icon-btn">
                                <MdAdd className="icon" />
                            </button>
                            <p className="action-name">Create new Backup set</p>
                        </div>
                    </div>

                    <div className="file-header">
                    <input
                        type="checkbox"
                        className="check-btn"
                        checked={selectedItems.length === files.reduce((acc, file) => acc + file.subFolder.length + 1, 0)}
                        onChange={() => this.onSelectItems(null, true)}
                    />
                        <p className="folder-header-name file">File/Folder name</p>
                        <p className="folder-header-name size">Size</p>
                        <p className="folder-header-name date">Date modified</p>
                    </div>

                    <div className="files-container">
                        {files.map(item => (
                            <>
                                <div className="file-con">
                                    <input
                                        type="checkbox"
                                        className="check-btn"
                                        checked={selectedItems.includes(`folder-${item.id}`)}
                                        onChange={() => this.onSelectItems(item)}
                                        
                                    />
                                    <RiFolderOpenFill className="icon-folder" />
                                    <p className="folder-header-name file color" onClick={() => this.toggleSubFolder(item.id)} id="filename">
                                        {item.name}
                                    </p>
                                    <p className="folder-header-name size">-</p>
                                    <p className="folder-header-name date">{item.date}</p>
                                    
                                </div>
                                {item.isSubFolderVisible && item.subFolder.map(subItem => (
                                    <div className="file-con sub-item" key={subItem.id}>
                                        <input
                                            type="checkbox"
                                            className="check-btn"
                                            checked={selectedItems.includes(`file-${subItem.id}`)}
                                            onChange={() => this.onSelectItems(subItem)}
                                        />
                                        <LuFileText className="icon-folder-sub" />
                                        <p className="folder-header-name file color">{subItem.name}</p>
                                        <p className="folder-header-name size size-name">{subItem.size}</p>
                                    <p className="folder-header-name date">{subItem.date}</p>
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                </div>

                <div className="div-two">
                    <div className="folder-header-two">
                        <div className="select-con">
                            <p className="header-name">Backup set Name:</p>
                            <select className="select">
                                <option>default Backup set</option>
                                <option>Manual Backup set</option>
                            </select>
                        </div>
                        <p className="header-name last">Backup Schedule:<RiArrowRightSLine className="arrow" size={20} /></p>
                    </div>

                    <div className="file-header header-div-2">
                        <div className="div-2-header">
                        <input
                        type="checkbox"
                        className="check-btn"
                        checked={div2SelectedItems.length === selectedItems.length}
                        onChange={() => this.onSelectDiv2Items(null, true)}
                    />
                        <p className="folder-header-name file">File/Folder name</p></div>
                        {div2SelectedItems.length > 0 && (
                    <button className="remove-btn" onClick={this.onRemoveFromDiv2}><MdDelete className="delete-icon"/>Remove</button>
                )}
                    </div>

                    <div className="files-container file-div-2">
                    {selectedItems.length === 0 ? (
                        <p className="empty-message">Add content to Backup set</p>
                    ) : (
                        files.map(item => (
                            <>
                                {selectedItems.includes(`folder-${item.id}`) && (
                                    <div className="file-con">
                                        <input
                                            type="checkbox"
                                            className="check-btn"
                                            checked={div2SelectedItems.includes(`folder-${item.id}`)}
                                            onChange={() => this.onSelectDiv2Items(item)}
                                        />
                                        <RiFolderOpenFill className="icon-folder" />
                                        <p className="folder-header-name file color">{item.name}</p>
                                    </div>
                                )}
                                {item.subFolder && item.subFolder.map(subItem => (
                                    !selectedItems.includes(`folder-${item.id}`) &&
                                    selectedItems.includes(`file-${subItem.id}`) && (
                                        <div className="file-con sub-item" key={subItem.id}>
                                            <input
                                                type="checkbox"
                                                className="check-btn"
                                                checked={div2SelectedItems.includes(`file-${subItem.id}`)}
                                                onChange={() => this.onSelectDiv2Items(subItem)}
                                            />
                                            <LuFileText className="icon-folder-sub" />
                                            <p className="folder-header-name file color">{subItem.name}</p>
                                        </div>
                                    )
                                ))}
                            </>
                        ))
                    )
                }

                    </div>

                    
                </div>
            </div>
        );
    }
}

export default Home;
