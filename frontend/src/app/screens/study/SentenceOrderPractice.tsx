import { useState } from 'react';
import { appendToken, sentenceText } from './sentenceOrder';

export function SentenceOrderPractice({ options }: { options: string[] }) {
  const [order, setOrder] = useState<number[]>([]);
  return <div className="flex flex-col gap-3 mb-3">
    <p className="text-xs text-muted-foreground">Chọn từng mảnh để ghép câu. Bấm mảnh đã chọn để bỏ; xem đáp án mẫu để tự đối chiếu.</p>
    <div className="flex flex-wrap gap-2" aria-label="Các mảnh câu">
      {options.map((text, index) => ({ text, index })).reverse().map(({ text, index }) => <button
        key={index} type="button" disabled={order.includes(index)}
        onClick={() => setOrder(current => appendToken(current, index, options.length))}
        className="min-h-11 px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed">
        {text}
      </button>)}
    </div>
    <div className="border rounded-lg p-3 flex flex-col gap-2 bg-muted/20">
      <p className="text-xs text-muted-foreground">Câu bạn ghép ({order.length}/{options.length})</p>
      <p role="status" className="break-words text-base" lang="ja">{sentenceText(options, order) || '…'}</p>
      <div className="flex flex-wrap gap-2">
        {order.map((index, position) => <button key={index} type="button"
          aria-label={`Bỏ mảnh ${position + 1}: ${options[index]}`}
          onClick={() => setOrder(current => current.filter(item => item !== index))}
          className="min-h-11 border rounded px-3 text-sm">{options[index]} ×</button>)}
      </div>
      <button type="button" disabled={!order.length} onClick={() => setOrder([])}
        className="self-start min-h-11 text-sm underline disabled:opacity-40">Ghép lại từ đầu</button>
    </div>
  </div>;
}
