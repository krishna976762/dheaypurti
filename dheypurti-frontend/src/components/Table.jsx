import React from "react";

export default function Table({ columns, data, actions }) {
  return (
    <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left text-gray-700">
              {col.label}
            </th>
          ))}
          {actions && <th className="px-4 py-2 text-left">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="border-t">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2">
                {row[col.key]}
              </td>
            ))}
            {actions && <td className="px-4 py-2">{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
