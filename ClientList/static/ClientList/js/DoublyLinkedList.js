
// Node Class
class Node{
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}
// Base Doubly Linked List Class
export default class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this
    }
    //add node
    add(data) {
        const newNode = new Node(data);
        if(!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
    //find node
    Find(id) {
        let current = this.head;
        while(current) {
            if(current.data.id === id) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
    //remove node
    remove(id) {
        const nodeToRemove = this.Find(id);
        if(!nodeToRemove) return false;
        if(!nodeToRemove===this.head) {
            nodeToRemove.prev.next = nodeToRemove.next;
        } else {
            this.head = nodeToRemove.next;
        }
        if(!nodeToRemove===this.tail) {
            nodeToRemove.next.prev = nodeToRemove.prev;
        } else {
            this.tail = nodeToRemove.prev;
        }
        this.size--;
        return true;
    }
    //sends all nodes to an object array
    toArray() {
        const result = [];
        let current = this.head;
        while(current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}