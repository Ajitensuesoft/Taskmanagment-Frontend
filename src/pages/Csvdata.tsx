
// import React from 'react';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { createCsv } from '../services/Apl';
interface CSVData {
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface FormInputs {
  csvFile: FileList;
}

export const CsvDataForm = () => {
  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    const file = data.csvFile[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    if (file.type !== "text/csv") {
      alert("Please upload a valid CSV file");
      return;
    }

    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async(results) => {
        const parsedData: CSVData[] = results.data as CSVData[];
        console.log("Parsed CSV Data:", parsedData);
     
     let finaldata=await createCsv(parsedData);
     console.log("finaldata",finaldata);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      }
    });

    reset();
  };

  return (
    <div style={{marginTop: '20px', textAlign:"center"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="csvFile">Import CSV file</label>
        <input
          type="file"
          accept=".csv"
          {...register("csvFile")}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
















//here csv data thunk not created


//thunk

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import Papa from "papaparse";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadCsv, resetCsvState } from "../store/appslice";
// import type { RootState, AppDispatch } from "../store/store";

// interface CSVData {
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
// }

// interface FormInputs {
//   csvFile: FileList;
// }

// export const CsvDataForm = () => {
//   const { register, handleSubmit, reset } = useForm<FormInputs>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { loading, error, success } = useSelector((state: RootState) => state.csv);

//   const [preview, setPreview] = useState<CSVData[]>([]);

//   const onSubmit = (data: FormInputs) => {
//     const file = data.csvFile[0];
//     if (!file) {
//       alert("No file selected!");
//       return;
//     }

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const parsedData: CSVData[] = results.data as CSVData[];
//         setPreview(parsedData.slice(0, 5)); // preview first 5 rows
//         dispatch(uploadCsv(parsedData));
//       },
//       error: (err) => {
//         console.error("Error parsing CSV:", err);
//       },
//     });

//     reset();
//   };

//   return (
//     <div style={{ marginTop: "20px", textAlign: "center" }}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <label htmlFor="csvFile">Import CSV file</label>
//         <input type="file" accept=".csv" {...register("csvFile")} />
//         <button type="submit" disabled={loading}>
//           {loading ? "Uploading..." : "Upload"}
//         </button>
//       </form>

//       {/* ✅ Show Preview */}
//       {preview.length > 0 && (
//         <table border={1} style={{ margin: "20px auto" }}>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Priority</th>
//             </tr>
//           </thead>
//           <tbody>
//             {preview.map((row, i) => (
//               <tr key={i}>
//                 <td>{row.title}</td>
//                 <td>{row.description}</td>
//                 <td>{row.status}</td>
//                 <td>{row.priority}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* ✅ Show Success/Error */}
//       {success && <p style={{ color: "green" }}>CSV uploaded successfully!</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };
