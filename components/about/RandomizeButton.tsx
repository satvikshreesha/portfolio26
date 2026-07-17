export function RandomizeButton({ disabled, form }: { disabled: boolean; form?: string }) {
  return (
    <button
      disabled={disabled}
      form={form}
      style={{
        alignItems: "center",
        background: "var(--surface-raised)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        boxShadow: "var(--shadow-float)",
        color: disabled ? "var(--muted)" : "var(--text-nav-active)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        fontFamily: "var(--font-mono)",
        fontSize: 13.65,
        fontWeight: 500,
        height: 29,
        justifyContent: "center",
        opacity: disabled ? 0.64 : 1,
        paddingInline: 13,
      }}
      type="submit"
    >
      Randomize
    </button>
  );
}
