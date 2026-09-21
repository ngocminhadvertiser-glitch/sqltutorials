import React, { useState } from 'react';
import { SAMPLE_DATABASES } from '../data/sampleDatabases';
import { Key, Link, ShieldCheck, Database, Table, Eye, ArrowRight, Play, Info } from 'lucide-react';
import { sqlEngine } from '../services/sqlEngine';

interface DatabaseSchemaViewerProps {
  currentDbId: string;
  onSendToPlayground: (sql: string) => void;
}

export const DatabaseSchemaViewer: React.FC<DatabaseSchemaViewerProps> = ({
  currentDbId,
  onSendToPlayground,
}) => {
  const currentDb = SAMPLE_DATABASES.find((db) => db.id === currentDbId) || SAMPLE_DATABASES[0];
  const tables = sqlEngine.getTables(currentDbId);
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.name || '');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const activeTableObj = tables.find((t) => t.name === selectedTable) || tables[0];
  const tableData = activeTableObj ? sqlEngine.getTableData(activeTableObj.name) : [];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              Sơ đồ Thực thể & Thiết kế CSDL Quan hệ
            </div>
            <h2 className="text-2xl font-black tracking-tight">{currentDb.name}</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">{currentDb.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 font-medium">
              {currentDb.tables.length} bảng dữ liệu
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Key className="w-3.5 h-3.5" />
            </div>
            <span><strong>PK</strong>: Khóa chính (Duy nhất, NOT NULL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-400/20 text-blue-300 flex items-center justify-center font-bold">
              <Link className="w-3.5 h-3.5" />
            </div>
            <span><strong>FK</strong>: Khóa ngoại (Tham chiếu bảng khác)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span><strong>Constraints</strong>: NOT NULL, CHECK, UNIQUE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-purple-400/20 text-purple-300 flex items-center justify-center font-bold">
              1-N
            </div>
            <span><strong>Quan hệ 1 - Nhiều</strong>: Chuẩn hóa dữ liệu</span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tables.map((table) => {
          const isSelected = selectedTable === table.name;
          return (
            <div
              key={table.name}
              id={`table-card-${table.name}`}
              className={`rounded-2xl border transition-all bg-white shadow-xs overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Table Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    table.isUserCreated ? 'bg-amber-600' : 'bg-indigo-600'
                  }`}>
                    <Table className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">
                        [{table.name}]
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({table.displayName})
                      </span>
                      {table.isUserCreated && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                          Tạo bởi học sinh (DDL)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{table.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`preview-table-${table.name}`}
                    onClick={() => {
                      setSelectedTable(table.name);
                      setShowPreviewModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-200 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                    title="Xem trước dữ liệu bảng"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Dữ liệu</span>
                  </button>
                  <button
                    id={`query-table-${table.name}`}
                    onClick={() => {
                      onSendToPlayground(`SELECT * FROM ${table.name};`);
                    }}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Mở trong bộ chạy SQL"
                  >
                    <Play className="w-3 h-3 fill-indigo-700" />
                    <span>SELECT *</span>
                  </button>
                </div>
              </div>

              {/* Columns Table */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {table.columns.map((col) => (
                  <div
                    key={col.name}
                    className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {col.isPrimaryKey ? (
                        <span
                          className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0"
                          title="Khóa chính (PRIMARY KEY)"
                        >
                          <Key className="w-3 h-3" />
                        </span>
                      ) : col.isForeignKey ? (
                        <span
                          className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0"
                          title={`Khóa ngoại (FOREIGN KEY) -> ${col.referencesTable}(${col.referencesColumn})`}
                        >
                          <Link className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          •
                        </span>
                      )}

                      <div className="truncate">
                        <span className="font-mono font-bold text-slate-800">
                          {col.name}
                        </span>
                        {col.isForeignKey && col.referencesTable && (
                          <span className="ml-2 text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            → {col.referencesTable}({col.referencesColumn})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-500 font-medium">
                        {col.type}
                      </span>
                      {col.nullable === false && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          NOT NULL
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Relational Connections Explanation Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-indigo-600" />
          Giải thích Mối quan hệ giữa các bảng trong CSDL {currentDb.name}
        </h3>
        {currentDb.id === 'QuanLyHocSinh' ? (
          <div className="space-y-2 text-sm text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
              <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">
                Quan hệ 1 - N
              </span>
              <div>
                <strong>LopHoc (1) ───&lt; (N) HocSinh</strong>: Một lớp học có nhiều học sinh. Một học sinh chỉ thuộc về duy nhất một lớp.
                Khóa ngoại <code className="text-blue-700 font-mono text-xs bg-blue-50 px-1 rounded">HocSinh.MaLop</code> tham chiếu đến khóa chính <code className="text-amber-700 font-mono text-xs bg-amber-50 px-1 rounded">LopHoc.MaLop</code>.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
              <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">
                Quan hệ N - N
              </span>
              <div>
                <strong>HocSinh (N) ─── KetQua ─── (N) MonHoc</strong>: Một học sinh học nhiều môn học, và một môn học có nhiều học sinh tham gia.
                Quan hệ Nhiều - Nhiều này được phân rã thành hai quan hệ 1-N thông qua bảng trung gian <strong>KetQua</strong> với khóa chính kép <code className="text-amber-700 font-mono text-xs bg-amber-50 px-1 rounded">(MaHS, MaMH)</code>.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
              <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">
                Quan hệ 1 - N
              </span>
              <div>
                <strong>KhachHang (1) ───&lt; (N) HoaDon</strong>: Một khách hàng có thể có nhiều hóa đơn mua sắm. Cột <code className="text-blue-700 font-mono text-xs bg-blue-50 px-1 rounded">HoaDon.MaKH</code> trỏ đến <code className="text-amber-700 font-mono text-xs bg-amber-50 px-1 rounded">KhachHang.MaKH</code>.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
              <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">
                Chi tiết đơn
              </span>
              <div>
                <strong>HoaDon ───&lt; ChiTietHD &gt;─── SanPham</strong>: Một hóa đơn có nhiều sản phẩm, một sản phẩm nằm trong nhiều hóa đơn. Bảng ChiTietHD lưu số lượng và đơn giá thực tế tại thời điểm mua.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Preview Modal */}
      {showPreviewModal && activeTableObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">
                  Dữ liệu hiện tại của bảng [{activeTableObj.name}]
                </h3>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                  {tableData.length} dòng
                </span>
              </div>
              <button
                id="close-preview-modal"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1">
              {tableData.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        {Object.keys(tableData[0]).map((key) => (
                          <th key={key} className="p-2.5 font-mono">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-slate-800">
                              {val === null || val === undefined ? (
                                <span className="text-slate-400 italic">NULL</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">Bảng này hiện chưa có dữ liệu.</p>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onSendToPlayground(`SELECT * FROM ${activeTableObj.name};`);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Mở lệnh SELECT này trong bộ chạy SQL
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
