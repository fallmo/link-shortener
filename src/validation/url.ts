interface urlParams {
    original_url: string
}

export const urlValid = (params: urlParams) => {
    const {original_url} = params;
    if(!original_url) return {error: "URL is required"};
    if(typeof original_url !== "string") return {error: "URL must be string"};
    if(!isFormatValid(original_url)) return {error: "URL format invalid"};

    return {error: null};
}

const isFormatValid = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}