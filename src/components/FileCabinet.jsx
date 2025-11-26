import React from 'react';
import FolderIcon from './FolderIcon';
import { folderData } from './FileCabinetData';


// Minimal placeholder component so the site can compile while you rewrite the file.
const FileCabinet = () => {
 const VERTICAL_OFFSET_VH = 2;
 const FOLDER_CLOSED_HEIGHT_VH = 8.4;
 const FOLDER_OPEN_HEIGHT_VH = 52;
 const CONTAINER_HEIGHT_VH = 63;
 const OPEN_POSITION_VH = 10.5;
 const BOTTOM_MARGIN_VH = 11;
 const Z_DEPTH_OPEN = 20;
 const Z_DEPTH_MULTIPLIER = -8;

 const [activeFolderId, setActiveFolderId] = React.useState(null);
 
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
     <div className="folders-container" style={{ position: 'relative', height: `${CONTAINER_HEIGHT_VH}vh` }}>
       <div className="stacked-folders">
         {folderData.map((folder, index) => {
           const isOpen = activeFolderId === folder.id;
           const tabPosition = getTabPosition(index);
           const baseBottomPosition = CONTAINER_HEIGHT_VH - (FOLDER_CLOSED_HEIGHT_VH + BOTTOM_MARGIN_VH);
           const topPosition = isOpen ? OPEN_POSITION_VH : baseBottomPosition + (index * VERTICAL_OFFSET_VH);
           const zIndex = index + 1;
           const zDepth = isOpen ? Z_DEPTH_OPEN : index * Z_DEPTH_MULTIPLIER;


           return (
             <FolderIcon
               key={folder.id}
               folder={folder}
               isOpen={isOpen}
               onClick={() => handleFolderClick(folder.id)}
               tabPosition={tabPosition}
               zDepth={zDepth}
               style={{
                 position: 'absolute',
                 top: `${topPosition}vh`,
                 zIndex: zIndex,
                 height: `${FOLDER_OPEN_HEIGHT_VH}vh`,
                 transition: 'top 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
             />
           );
         })}
       </div>
     </div>


     <style jsx>{`
       .file-cabinet-section {
         border: 2px solid red;
         padding: 1rem;
         position: relative;
         width: 100%;
         min-height: ${CONTAINER_HEIGHT_VH}vh;
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
         max-width: 60vw;
         height: ${CONTAINER_HEIGHT_VH}vh;
         display: flex;
         justify-content: center;
         align-items: center;
         overflow: hidden;
         top: 100%;
         border: 1px solid green;

         perspective: 125vh;
         perspective-origin: 50% 40%;
         transform-style: preserve-3d;
       }

       .stacked-folders {
           position: relative;
           width: 55vw;
           height: ${CONTAINER_HEIGHT_VH}vh;
           top: 0vh;
           border: 1px solid blue;
           transform-style: preserve-3d;
         }
     `}</style>
   </section>
 );
};


export default FileCabinet;