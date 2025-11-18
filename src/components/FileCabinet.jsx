import React from 'react';
import FolderIcon from './FolderIcon';
import { folderData } from './FileCabinetData';


// Minimal placeholder component so the site can compile while you rewrite the file.
const FileCabinet = () => {
 const [activeFolderId, setActiveFolderId] = React.useState(null);
 const verticalOffset = 20; // pixels between stacked folders
 const folderClosedHeight = 80; // height of closed folder tab in pixels
 const folderOpenHeight = 400; // height of open folder in pixels
 
 const handleFolderClick = (folderId) => {
   if (activeFolderId === folderId) {
     setActiveFolderId(null); // Close if already active
   } else {
     setActiveFolderId(folderId); // Open the clicked folder
   }
 }


 const getTabPosition = (index) => {
   const position = index % 3;
   if (position === 0) return 'left';
   if (position === 1) return 'center';
   return 'right';
 }


 return (
   <section id="file-cabinet-section" className="file-cabinet-section">
     <h2 className="section-title">File Cabinet (test for now)</h2>
     <div className="folders-container" style={{ position: 'relative', height: '600px' }}>
       <div className="stacked-folders">
         {folderData.map((folder, index) => {
           const topPosition = index * verticalOffset; // Vertically offset folders for stacking
           const zIndex = index + 1; // Higher index folders appear on top
           const isOpen = activeFolderId === folder.id;
           const tabPosition = getTabPosition(index);
           const visibleTabWidth = 40; // width of the visible part of the tab when folder is closed
           const numFolders = folderData.length;
           const folderWidth = 500; // in px
           const containerWidth = folderWidth + (numFolders - 1) * (visibleTabWidth); // total width of the container in vw


           return (
             <FolderIcon
               key={folder.id}
               folder={folder}
               isOpen={isOpen}
               onClick={() => handleFolderClick(folder.id)}
               tabPosition={tabPosition}
               style={{
                 position: 'absolute',
                 top: `${topPosition}px`,
                 zIndex: zIndex,
                 height: isOpen ? `${folderOpenHeight}px` : `${folderClosedHeight}px`,
               }}
             />
           );
         })}
       </div>
     </div>


     <style jsx>{`
       .file-cabinet-section {
         border: 2px solid red; /* debug: visible border to outline FileCabinet area */
         padding: 1rem;
         position: relative;
         width: 100%;
         min-height: 600px;
         top: 10vh;
         left: 0vw;
         display: flex;
         flex-direction: column;
         align-items: center;
       }


       .section-title {
         font-size: 2rem;
         margin-bottom: 1.5rem;
       }
        
       .folders-container {
         position: relative;
         width: 100%;
         max-width: 900px;
         height: 600px;
         display: flex;
         justify-content: center;
         overflow: visible;
         top: 100%;
         border: 1px solid green; /* debug: outline folders container area */
       }
        
       .stacked-folders {
           position: relative;
           width: 55vw;
           height: 600px;
           top: 0vh;
           border: 1px solid blue; /* debug: outline stacked folders area */
         }
     `}</style>
   </section>
 );
};


export default FileCabinet;



