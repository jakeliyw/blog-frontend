// export default removeMarkdown = (md) => {
//     // 移除标题
//     let text = md.replace(/^#+\s+/gm, '');
//     // 移除粗体、斜体
//     text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
//     text = text.replace(/\*([^*]+)\*/g, '$1');
//     text = text.replace(/_([^_]+)_/g, '$1');
//     // 移除链接
//     text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
//     // 移除图片
//     text = text.replace(/!\[([^\]]+)\]\([^)]+\)/g, '');
//     // 移除代码块
//     text = text.replace(/```[^`]+```/g, '');
//     text = text.replace(/`[^`]+`/g, '');
//     // 移除列表
//     text = text.replace(/^\s*[\*\-+]\s+/gm, '');
//     // 移除引用
//     text = text.replace(/^\s*>\s+/gm, '');
//     // 移除水平线
//     text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');
    
//     return text.trim();
// }

export function removeMarkdown(md) {
    if (!md) return '';
      
    // 移除图片 ![alt](url)
    let text = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
    
    // 移除标题
    text = text.replace(/^#+\s+/gm, '');
    
    // 移除粗体、斜体
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');
    
    // 移除链接 [text](url)
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 移除内联代码 `code`
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 移除代码块 ```code```
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // 移除无序列表标记 * - +
    text = text.replace(/^\s*[\*\-+]\s+/gm, '');
    
    // 移除有序列表标记 1. 2.
    text = text.replace(/^\s*\d+\.\s+/gm, '');
    
    // 移除引用 >
    text = text.replace(/^\s*>\s+/gm, '');
    
    // 移除水平线 --- *** ___
    text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');
    
    // 移除HTML标签（可选）
    // text = text.replace(/<[^>]+>/g, '');
    
    // 合并多个空行
    text = text.replace(/\n\s*\n/g, '\n\n');
    
    return text.trim();
}

export default removeMarkdown;
