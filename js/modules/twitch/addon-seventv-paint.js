const paintCache = new Map();

async function fetchPaintId(twitchId) {
  const res = await fetch("https://7tv.io/v3/gql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query GetUserByConnection($platform: ConnectionPlatform!, $id: String!) {
        userByConnection(platform: $platform, id: $id) {
          style { paint_id }
        }
      }`,
      variables: { platform: "TWITCH", id: String(twitchId) },
    }),
  });

  const json = await res.json();
  return json.data?.userByConnection?.style?.paint_id ?? null;
}

async function applyUsernamePaint(element, twitchId) {
  const key = String(twitchId);

  if (!paintCache.has(key)) {
    
    console.debug(`[ChatRD][Twitch][7TV-Paint] Paint for user ${twitchId} not found. Setting it...`);

    try {
      paintCache.set(key, await fetchPaintId(twitchId));
      console.debug(`[ChatRD][Twitch][7TV-Paint] Paint for user ${twitchId} set!`);
    }
    catch (err) {
      console.warn(`[ChatRD][Twitch][7TV-Paint] Falha ao buscar paint para ${twitchId}:`, err);
      return;
    }
  }

  const paintId = paintCache.get(key);
  console.debug(`[ChatRD][Twitch][7TV-Paint] Paint for user ${twitchId} found!`);
  if (paintId) element.setAttribute("data-seventv-paint-id", paintId);
}