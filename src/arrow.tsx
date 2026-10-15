const paths = {
  'up-right': 'M4.5 11.5 11.5 4.5M5.5 4.5h6v6',
  down: 'M8 3v10M3.5 8.5 8 13l4.5-4.5',
}

export function ArrowIcon({ dir }: { dir: keyof typeof paths }) {
  return <svg className="arrow-icon" viewBox="0 0 16 16" width="0.9em" height="0.9em" aria-hidden="true" focusable="false"><path d={paths[dir]} /></svg>
}
