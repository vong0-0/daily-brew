import "server-only";

const DEFAULT_DELAY_MS = 10000;

function isSlowNetworkEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    (process.env.NEXT_PUBLIC_SLOW_NETWORK === "true" ||
      process.env.SLOW_NETWORK === "true")
  );
}

export async function slowNetwork(delayMs = DEFAULT_DELAY_MS) {
  if (!isSlowNetworkEnabled()) {
    return;
  }

  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
