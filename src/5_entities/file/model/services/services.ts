import {api} from "@/6_shared";

export interface IUploadedFile {
    id: number;
    url: string;
}

interface UploadResponse {
    message: string;
    extra: IUploadedFile;
}

export const fileService = {
    upload(file: File): Promise<UploadResponse> {
        return api.uploadFile<UploadResponse>("/files/", file, "file");
    },

    delete(id: number): Promise<{ message: string }> {
        return api.delete(`/files/${id}/`);
    },
};
