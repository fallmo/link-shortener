interface urlParams {
    original_url: string
}

export const urlValid = (params: urlParams) => {
    const {original_url} = params;
    if(!original_url) return {error: "Url is required"};
    if(typeof original_url !== "string") return {error: "Url must be string"};
    if(!original_url.includes(".") || original_url.length < 3) return {error: "Url format invalid"};

    return {error: null};
}