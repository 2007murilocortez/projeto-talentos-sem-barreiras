/**
 * Erro esperado não vira exceção (ADR-006): casos de uso devolvem esta união
 * discriminada, e quem chama é obrigado pelo compilador a tratar a falha.
 * `throw` fica reservado a bug de programação.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function fail<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

export function isFail<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

/** Transforma o valor de sucesso, preservando a falha intacta. */
export function mapResult<T, U, E>(result: Result<T, E>, transform: (value: T) => U): Result<U, E> {
  return result.ok ? ok(transform(result.value)) : result;
}

/** Extrai o valor, caindo no padrão quando houve falha. */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

/**
 * Ponte para as fronteiras que ainda lançam exceção (SDK do Supabase, fetch).
 * Só deve ser usada dentro de adapters, nunca em casos de uso.
 */
export async function fromPromise<T, E>(
  promise: Promise<T>,
  toError: (cause: unknown) => E
): Promise<Result<T, E>> {
  try {
    return ok(await promise);
  } catch (cause) {
    return fail(toError(cause));
  }
}
