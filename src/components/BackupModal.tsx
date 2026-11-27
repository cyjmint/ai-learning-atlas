import { useRef, useState, type ChangeEvent } from 'react';
import { AlertCircle, CheckCircle2, Download, RotateCcw, Upload, X } from 'lucide-react';
import type { AtlasProgressState } from '../types/atlas';
import { parseAndValidateBackup, serializeBackup } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  state: AtlasProgressState;
  onClose: () => void;
  onImport: (state: AtlasProgressState) => void;
  onReset: () => void;
}

export function BackupModal({
  isOpen,
  state,
  onClose,
  onImport,
  onReset,
}: BackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = serializeBackup(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `frontier-ai-atlas-backup-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setFeedback({
      type: 'success',
      message: '현재 학습 진도와 설정을 JSON 파일로 내보냈습니다.',
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseAndValidateBackup(text);
      if (!result.ok) {
        setFeedback({ type: 'error', message: result.error });
      } else {
        onImport(result.state);
        setFeedback({
          type: 'success',
          message: `복원 완료: ${result.state.completedStages.length}개 완료 단계를 불러왔습니다.`,
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: '파일을 읽는 중 오류가 발생했습니다.',
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onReset();
    setConfirmReset(false);
    setFeedback({
      type: 'success',
      message: '모든 학습 진도가 초기화되었습니다.',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="backup-modal-title"
              className="font-serif-editorial text-xl font-semibold text-[var(--text-ink)]"
            >
              진도 백업 및 복원
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              회원가입 없이 브라우저에 자동 저장된 진도를 JSON 파일로 백업하거나 다른 기기로 옮길 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Download className="h-4 w-4" />
            JSON 백업 파일 내보내기
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-ink)] transition-colors hover:border-[var(--accent)]"
          >
            <Upload className="h-4 w-4" />
            JSON 백업 파일 불러오기
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-xs ${
              feedback.type === 'success'
                ? 'border-[var(--teal)]/40 bg-[var(--teal-soft)] text-[var(--teal)]'
                : 'border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[var(--text-muted)]">
              현재 완료: {state.completedStages.length}개 단계
            </span>
            <button
              type="button"
              onClick={handleReset}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                confirmReset
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--accent)]'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {confirmReset ? '정말 초기화할까요? (다시 클릭)' : '진도 초기화'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
