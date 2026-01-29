
import React, { useState } from 'react';
import { FileText, Wand2, Download, AlertCircle, RefreshCw, Briefcase, UserCircle } from 'lucide-react';
import { tailorCV } from './services/geminiService';
import { generateWordDoc } from './services/docxService';
import { CVData, AppState } from './types';

const App: React.FC = () => {
  const [originalCV, setOriginalCV] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredData, setTailoredData] = useState<CVData | null>(null);
  const [status, setStatus] = useState<AppState>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTailor = async () => {
    if (!originalCV.trim() || !jobDescription.trim()) {
      setErrorMessage('נא למלא גם את קורות החיים וגם את תיאור המשרה.');
      return;
    }

    setStatus('LOADING');
    setErrorMessage('');
    
    try {
      const result = await tailorCV(originalCV, jobDescription);
      setTailoredData(result);
      setStatus('SUCCESS');
    } catch (error) {
      console.error(error);
      setErrorMessage('אירעה שגיאה בתהליך העיבוד. נא לנסות שוב.');
      setStatus('ERROR');
    }
  };

  const handleDownload = async () => {
    if (!tailoredData) return;
    try {
      await generateWordDoc(tailoredData);
    } catch (error) {
      alert('שגיאה בהורדת הקובץ');
    }
  };

  const reset = () => {
    setTailoredData(null);
    setStatus('IDLE');
    setOriginalCV('');
    setJobDescription('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4 flex items-center justify-center gap-2">
          <Wand2 className="w-10 h-10 text-blue-600" />
          מעצב קורות חיים חכם (AI)
        </h1>
        <p className="text-lg text-gray-600">העלה את פרטיך ואת תיאור המשרה, ותן ל-AI לייצר עבורך קובץ מושלם להורדה.</p>
      </header>

      {status === 'IDLE' || status === 'LOADING' || status === 'ERROR' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <UserCircle className="w-5 h-5 text-blue-500" />
              קורות החיים המקוריים שלך
            </h2>
            <textarea
              className="w-full h-[400px] p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
              placeholder="הדבק כאן את הטקסט של קורות החיים הנוכחיים שלך..."
              value={originalCV}
              onChange={(e) => setOriginalCV(e.target.value)}
              disabled={status === 'LOADING'}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Briefcase className="w-5 h-5 text-blue-500" />
              תיאור המשרה המבוקשת
            </h2>
            <textarea
              className="w-full h-[400px] p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
              placeholder="הדבק כאן את תיאור המשרה כפי שמופיע במודעת הדרושים..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={status === 'LOADING'}
            />
          </div>

          <div className="md:col-span-2 flex flex-col items-center">
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5" />
                {errorMessage}
              </div>
            )}
            
            <button
              onClick={handleTailor}
              disabled={status === 'LOADING'}
              className={`
                group relative px-12 py-4 rounded-full text-white text-xl font-bold transition-all
                ${status === 'LOADING' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg'}
              `}
            >
              {status === 'LOADING' ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  מעבד קורות חיים...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="w-6 h-6" />
                  התאם לי את קורות החיים
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">תצוגה מקדימה: קורות חיים מותאמים</h2>
              <p className="text-sm text-gray-500">ה-AI התאים את הניסיון שלך לדרישות הספציפיות של המשרה.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                התחל מחדש
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-md"
              >
                <Download className="w-5 h-5" />
                הורד כקובץ Word
              </button>
            </div>
          </div>

          <div className="space-y-6 text-gray-800 leading-relaxed" dir="auto">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold">{tailoredData?.fullName}</h3>
              <p className="text-gray-600">{tailoredData?.email} | {tailoredData?.phone} {tailoredData?.linkedin && ` | ${tailoredData.linkedin}`}</p>
            </div>

            <section>
              <h4 className="text-xl font-bold border-b-2 border-blue-600 inline-block mb-3">תמצית מקצועית</h4>
              <p>{tailoredData?.summary}</p>
            </section>

            <section>
              <h4 className="text-xl font-bold border-b-2 border-blue-600 inline-block mb-3">ניסיון תעסוקתי</h4>
              <div className="space-y-4">
                {tailoredData?.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-lg">{exp.company}</span>
                      <span className="text-gray-500 text-sm">{exp.duration}</span>
                    </div>
                    <p className="italic text-blue-700 mb-2">{exp.role}</p>
                    <ul className="list-disc pr-6 space-y-1">
                      {exp.description.map((point, pi) => (
                        <li key={pi} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-xl font-bold border-b-2 border-blue-600 inline-block mb-3">כישורים ומיומנויות</h4>
              <div className="flex flex-wrap gap-2">
                {tailoredData?.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-xl font-bold border-b-2 border-blue-600 inline-block mb-3">השכלה</h4>
              <ul className="space-y-2">
                {tailoredData?.education.map((edu, i) => (
                  <li key={i}>
                    <span className="font-bold">{edu.degree}</span> - {edu.institution} ({edu.graduationYear})
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      <footer className="mt-20 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} CV Tailor AI - פותח עבורך כדי להגיע למשרה הבאה.
      </footer>
    </div>
  );
};

export default App;
