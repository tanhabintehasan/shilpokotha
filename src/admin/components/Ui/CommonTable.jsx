import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

const CommonTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-[#800020]">
            <tr>
              <th className="p-5 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/30 bg-transparent accent-white cursor-pointer"
                />
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="p-5 text-[11px] font-black text-white/90 uppercase tracking-[0.1em]"
                >
                  {col.header}
                </th>
              ))}
              <th className="p-5 text-[11px] font-black text-white/90 uppercase tracking-[0.1em] text-right">
                Operations
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-red-50/30 transition-all duration-200 group"
                >
                  <td className="p-5 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 accent-[#800020] cursor-pointer"
                    />
                  </td>
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className="p-5 text-sm text-gray-700 font-medium"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  <td className="p-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onView(row)}
                        title="View Details"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(row)}
                        title="Edit Item"
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        title="Delete Item"
                        className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="p-20 text-center text-gray-400 italic"
                >
                  No data found in this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommonTable;
