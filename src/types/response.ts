interface Fail {
    success: false;
    message: string;
}

interface Success{
    success: true,
    data: any
}

type Response = Success | Fail;

export default Response