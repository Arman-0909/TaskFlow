from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate
from app.dependencies import get_current_user

router = APIRouter()


# CREATE TASK
@router.post("/", status_code=201)
def create_task(
    task: TaskCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_task = Task(
        title=task.title,
        description=task.description,
        owner=current_user.username
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message": "Task created",
        "task_id": new_task.id
    }


# GET TASKS
@router.get("/")
def get_tasks(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role == "admin":
        tasks = db.query(Task).all()

    else:
        tasks = db.query(Task).filter(
            Task.owner == current_user.username
        ).all()

    return tasks


# UPDATE TASK
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: TaskUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if (
        db_task.owner != current_user.username
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    db_task.title = task.title
    db_task.description = task.description
    db_task.completed = task.completed

    db.commit()

    return {
        "message": "Task updated"
    }


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if (
        db_task.owner != current_user.username
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    db.delete(db_task)
    db.commit()

    return {
        "message": "Task deleted"
    }