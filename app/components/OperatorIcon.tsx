import r6operators from 'r6operators';

const ops = r6operators as Record<string, any>;

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function OperatorIcon({ name, size = 36 }: { name: string; size?: number }) {
  const key = normalize(name);
  const op = ops[key];

  if (!op || typeof op.toSVG !== 'function') {
    return (
      <div
        className="av md"
        style={{ width: size, height: Math.round(size * 1.1), fontSize: Math.round(size * 0.33) }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  const svg = op.toSVG();
  const pad = Math.round(size * 0.1);

  return (
    <div
      style={{
        width: size,
        height: size,
        padding: pad,
        background: '#141e2e',
        border: '1px solid var(--line-dim)',
        flexShrink: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
