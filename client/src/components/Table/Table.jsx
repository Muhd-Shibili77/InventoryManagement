export default function Table({ data, columns,renderRow }) {
    return (
      <table className="w-full mt-4 table-auto border-collapse">
        <thead>
          <tr className="bg-blue-100">
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2 border">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {data && data.length > 0 ? (
          data.map((item, i) => (
            <tr key={item._id || i} className="hover:bg-gray-100">
              {renderRow(item)}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              No data found.
            </td>
          </tr>
        )}
        </tbody>
      </table>
    );
  }
  