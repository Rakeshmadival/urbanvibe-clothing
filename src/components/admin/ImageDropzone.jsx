import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

// images: array of { id, url, file?, progress?, uploading? }
// - Existing saved images arrive as { id, url } (no file/progress)
// - Newly dropped files get a local blob preview immediately, then progress
//   fields are updated by the parent as the real upload runs
export default function ImageDropzone({ images, onAddFiles, onRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length) onAddFiles(files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed flex flex-col items-center justify-center text-center py-10 px-4 cursor-pointer transition-colors ${
          dragOver ? 'border-gold bg-gold/5' : 'border-ink/20 hover:border-ink/40'
        }`}
      >
        <UploadCloud size={28} className="text-gold-deep mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium mb-1">Drag &amp; drop product photos here</p>
        <p className="text-xs text-fog">or click to browse — JPG/PNG, multiple files supported</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square bg-sand overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {img.uploading && (
                <div className="absolute inset-0 bg-ink/60 flex flex-col items-center justify-center text-ivory">
                  <Loader2 size={18} className="animate-spin mb-1" />
                  <span className="text-[10px]">{Math.round(img.progress || 0)}%</span>
                </div>
              )}
              {!img.uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(img.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/70 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
