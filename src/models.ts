/**
 * @file 同步模型
 * @author Emac
 * @date 2025-01-05
 */
export interface Note {
	id: string;
	title: string;
	createDate: number;
	modifyDate: number;
	folderId: string;
}

export interface Folder {
	id: string;
	name: string;
	createDate: number;
}

export interface ImageInfo {
	fileId: string;
	fileType: string;
	/** 图片在 vault 中的友好文件名（含扩展名），由 NoteSyncer 按笔记名生成 */
	name?: string;
}

export interface SyncInfo {
	id: string;
	type: string;
	name: string;
	relativePath: string;
	syncTime: number;
}
