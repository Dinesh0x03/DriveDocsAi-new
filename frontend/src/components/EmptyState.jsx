const emptyImg =
  "https://static.prod-images.emergentagent.com/jobs/d45d6264-1b2b-4c05-abc3-3e77c7d5dae9/images/3b15f677e7349143404be74b6c069ec7f39bd77a9bc1b923158c2153a2f3893e.png";

export default function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <div
      className="border border-zinc-300 bg-white px-8 py-12 text-center"
      data-testid="empty-state"
    >
      <img
        src={emptyImg}
        alt=""
        className="mx-auto w-40 h-40 object-contain mb-6 opacity-90"
      />

      <div className="text-[10px] uppercase text-zinc-500 mb-3">
        [ empty ]
      </div>

      <h2 className="text-3xl font-bold text-zinc-950 mb-3">
        {title}
      </h2>

      <p className="text-sm text-zinc-600 max-w-md mx-auto">
        {body}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}