 Array.from(document.getElementsByClassName("card")).forEach(e => {
//     e.addEventListener("click", async event => {
//         // Access the dataset from the currentTarget
//         const folder = event.currentTarget.dataset.folder;
//         if (folder) {
//             songs = await getSongs(`songs/${folder}`);
//             console.log("Songs loaded:", songs); // Log the loaded songs
//         } else {
//             console.error("No folder dataset found");
//         }
//     });
// });