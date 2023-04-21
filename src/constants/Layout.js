LayoutConstants = {
	borderRadius: 6,
	borderWidth: 1,
	borderColor: '#666',

    ListItemPositions: {
        single: "single", 
        header: "header",
        middle: "middle", 
        footer: "footer"

        
    }
}

export default LayoutConstants

export function getListItemPosition(listlength, index){
    if (listlength === 1) return LayoutConstants.ListItemPositions.single
    if (index === 0) return LayoutConstants.ListItemPositions.header
    if (index === listlength - 1) return LayoutConstants.ListItemPositions.footer
    return LayoutConstants.ListItemPositions.middle
}
