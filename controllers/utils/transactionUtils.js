export function groupRooms(uniqueRoomIds, existRooms) {
    const roomGroups = uniqueRoomIds.map(i => {
        const groupedRoomNums = existRooms.reduce((acc, curr) => {
            if (curr.roomId === i)
                return [...acc, ...curr.roomNumbers]
            else
                return acc
        }, [])
        return {
            roomId: i,
            roomNumbers: groupedRoomNums
        }
    })

    return roomGroups
}

export default { groupRooms }