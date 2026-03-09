export default function ProblemCard({ item, onUpvote, showAdmin = false, onTogglePublic, onToggleOpportunity, onAddNote }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="text-xs uppercase tracking-wide text-brand">{item.category}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.votes} votes</span>
      </div>
      <p className="mb-3 text-sm text-slate-700">{item.description}</p>
      {item.screenshot_url && (
        <a className="mb-3 block text-sm text-brand underline" href={item.screenshot_url} target="_blank" rel="noreferrer">
          View screenshot
        </a>
      )}
      {item.solution_comment && <p className="mb-2 rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">Solution: {item.solution_comment}</p>}
      {item.admin_note && <p className="mb-2 rounded-md bg-amber-50 p-2 text-sm text-amber-700">Admin note: {item.admin_note}</p>}
      {item.is_opportunity && <p className="mb-2 text-xs font-semibold text-purple-600">🚀 Tagged as startup opportunity</p>}
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
          onClick={() => onUpvote?.(item.id)}
        >
          Upvote
        </button>
        {showAdmin && (
          <>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => onTogglePublic?.(item)}>
              {item.is_public ? 'Make Private' : 'Make Public'}
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => onToggleOpportunity?.(item)}>
              {item.is_opportunity ? 'Unmark Opportunity' : 'Mark Opportunity'}
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => onAddNote?.(item)}>
              Add Note
            </button>
          </>
        )}
      </div>
    </article>
  );
}
