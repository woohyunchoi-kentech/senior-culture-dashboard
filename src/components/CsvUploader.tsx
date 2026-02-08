'use client';

import { useState, useRef } from 'react';
import type { Respondent } from '@/types';
import { parseCSVToRespondents } from '@/lib/csv';

interface CsvUploaderProps {
  onImport: (respondents: Respondent[]) => void;
}

export default function CsvUploader({ onImport }: CsvUploaderProps) {
  const [preview, setPreview] = useState<Respondent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseCSVToRespondents(text);
      setPreview(result.respondents);
      setErrors(result.errors);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    onImport(preview);
    setPreview([]);
    setFileName('');
    setErrors([]);
    if (fileRef.current) fileRef.current.value = '';
    alert(`${preview.length}건의 데이터를 가져왔습니다.`);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <div className="text-gray-500">
            <p className="text-lg mb-2">CSV 파일을 선택하세요</p>
            <p className="text-sm">클릭하여 파일 선택</p>
          </div>
        </label>
        {fileName && <p className="mt-2 text-sm text-blue-600">{fileName}</p>}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">파싱 오류</h4>
          {errors.slice(0, 5).map((err, i) => (
            <p key={i} className="text-sm text-red-600">{err}</p>
          ))}
          {errors.length > 5 && <p className="text-sm text-red-400">... 외 {errors.length - 5}건</p>}
        </div>
      )}

      {preview.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기 ({preview.length}건)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2 text-gray-700">ID</th>
                  <th className="border px-3 py-2 text-gray-700">성별</th>
                  <th className="border px-3 py-2 text-gray-700">연령대</th>
                  <th className="border px-3 py-2 text-gray-700">학력</th>
                  <th className="border px-3 py-2 text-gray-700">소득</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td className="border px-3 py-1 text-gray-700">{r.id}</td>
                    <td className="border px-3 py-1 text-gray-700">{r.gender}</td>
                    <td className="border px-3 py-1 text-gray-700">{r.ageGroup}</td>
                    <td className="border px-3 py-1 text-gray-700">{r.educationLevel}</td>
                    <td className="border px-3 py-1 text-gray-700">{r.incomeLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 5 && <p className="text-sm text-gray-400 mt-1">... 외 {preview.length - 5}건</p>}
          </div>
          <button
            onClick={handleImport}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {preview.length}건 가져오기
          </button>
        </div>
      )}
    </div>
  );
}
